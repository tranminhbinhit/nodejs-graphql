"use strict";
/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModel = void 0;
const graphql_1 = require("graphql");
const constants_1 = require("../constants");
const get_definition_nodes_1 = require("../schema/get-definition-nodes");
const get_field_type_meta_1 = __importDefault(require("../schema/get-field-type-meta"));
const utils_1 = require("../utils/utils");
const CypherAnnotation_1 = require("./annotation/CypherAnnotation");
const Attribute_1 = require("./attribute/Attribute");
const CompositeEntity_1 = require("./entity/CompositeEntity");
const ConcreteEntity_1 = require("./entity/ConcreteEntity");
const Neo4jGraphQLSchemaModel_1 = require("./Neo4jGraphQLSchemaModel");
function generateModel(document) {
    const definitionNodes = (0, get_definition_nodes_1.getDefinitionNodes)(document);
    const concreteEntities = definitionNodes.objectTypes.map(generateConcreteEntity);
    const concreteEntitiesMap = concreteEntities.reduce((acc, entity) => {
        if (acc.has(entity.name)) {
            throw new Error(`Duplicate node ${entity.name}`);
        }
        acc.set(entity.name, entity);
        return acc;
    }, new Map());
    // TODO: add interfaces as well
    const compositeEntities = definitionNodes.unionTypes.map((entity) => {
        return generateCompositeEntity(entity, concreteEntitiesMap);
    });
    return new Neo4jGraphQLSchemaModel_1.Neo4jGraphQLSchemaModel({ compositeEntities, concreteEntities });
}
exports.generateModel = generateModel;
function generateCompositeEntity(definition, concreteEntities) {
    const compositeFields = (definition.types || []).map((type) => {
        const concreteEntity = concreteEntities.get(type.name.value);
        if (!concreteEntity) {
            throw new Error(`Could not find concrete entity with name ${type.name.value}`);
        }
        return concreteEntity;
    });
    if (!compositeFields.length) {
        throw new Error(`Composite entity ${definition.name.value} has no concrete entities`);
    }
    return new CompositeEntity_1.CompositeEntity({
        name: definition.name.value,
        concreteEntities: compositeFields,
    });
}
function generateConcreteEntity(definition) {
    const fields = (definition.fields || []).map(generateField);
    const directives = (definition.directives || []).reduce((acc, directive) => {
        acc.set(directive.name.value, parseArguments(directive));
        return acc;
    }, new Map());
    const labels = getLabels(definition, directives.get("node") || {});
    return new ConcreteEntity_1.ConcreteEntity({
        name: definition.name.value,
        labels,
        attributes: (0, utils_1.filterTruthy)(fields),
    });
}
function getLabels(definition, nodeDirectiveArguments) {
    // TODO: use when removing label & additionalLabels
    // const nodeExplicitLabels = nodeDirectiveArguments.labels as string[];
    // return nodeExplicitLabels ?? [definition.name.value];
    if (nodeDirectiveArguments.labels?.length) {
        return nodeDirectiveArguments.labels;
    }
    const nodeLabel = nodeDirectiveArguments.label;
    const additionalLabels = (nodeDirectiveArguments.additionalLabels || []);
    const label = nodeLabel || definition.name.value;
    return [label, ...additionalLabels];
}
function generateField(field) {
    const typeMeta = (0, get_field_type_meta_1.default)(field.type); // TODO: without originalType
    if (constants_1.SCALAR_TYPES.includes(typeMeta.name)) {
        const annotations = createFieldAnnotations(field.directives || []);
        return new Attribute_1.Attribute({
            name: field.name.value,
            annotations,
        });
    }
}
function createFieldAnnotations(directives) {
    return (0, utils_1.filterTruthy)(directives.map((directive) => {
        switch (directive.name.value) {
            case "cypher":
                return parseCypherAnnotation(directive);
            default:
                return undefined;
        }
    }));
}
function parseCypherAnnotation(directive) {
    const { statement } = parseArguments(directive);
    if (!statement || typeof statement !== "string") {
        throw new Error("@cypher statement required");
    }
    return new CypherAnnotation_1.CypherAnnotation({
        statement: statement,
    });
}
function parseArguments(directive) {
    return (directive.arguments || [])?.reduce((acc, argument) => {
        acc[argument.name.value] = getArgumentValueByType(argument.value);
        return acc;
    }, {});
}
function getArgumentValueByType(argumentValue) {
    // TODO: parse other kinds
    if (argumentValue.kind === graphql_1.Kind.STRING) {
        return argumentValue.value;
    }
    if (argumentValue.kind === graphql_1.Kind.LIST) {
        return argumentValue.values.map((v) => getArgumentValueByType(v));
    }
}
//# sourceMappingURL=generate-model.js.map