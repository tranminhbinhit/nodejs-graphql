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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSubscriptionConnectionWhereType = exports.generateSubscriptionWhereType = void 0;
const to_compose_1 = require("../to-compose");
const upper_first_1 = require("../../utils/upper-first");
function generateSubscriptionWhereType(node, schemaComposer) {
    const typeName = node.name;
    const whereFields = (0, to_compose_1.objectFieldsToSubscriptionsWhereInputFields)(typeName, [
        ...node.primitiveFields,
        ...node.enumFields,
        ...node.scalarFields,
        ...node.temporalFields,
        ...node.pointFields,
    ]);
    return schemaComposer.createInputTC({
        name: `${node.name}SubscriptionWhere`,
        fields: whereFields,
    });
}
exports.generateSubscriptionWhereType = generateSubscriptionWhereType;
function generateSubscriptionConnectionWhereType({ node, schemaComposer, relationshipFields, interfaceCommonFields, }) {
    const fieldName = node.subscriptionEventPayloadFieldNames.create_relationship;
    const typeName = node.name;
    let connectedNode = schemaComposer.getITC(`${typeName}SubscriptionWhere`);
    if (!connectedNode) {
        connectedNode = schemaComposer.createInputTC({
            name: `${typeName}SubscriptionWhere`,
            fields: (0, to_compose_1.objectFieldsToSubscriptionsWhereInputFields)(typeName, [
                ...node.primitiveFields,
                ...node.enumFields,
                ...node.scalarFields,
                ...node.temporalFields,
                ...node.pointFields,
            ]),
        });
    }
    return {
        created: schemaComposer.createInputTC({
            name: `${typeName}RelationshipCreatedSubscriptionWhere`,
            fields: {
                [fieldName]: connectedNode,
                createdRelationship: getRelationshipConnectionWhereTypes({
                    node,
                    schemaComposer,
                    relationshipFields,
                    interfaceCommonFields,
                }),
            },
        }),
        deleted: schemaComposer.createInputTC({
            name: `${typeName}RelationshipDeletedSubscriptionWhere`,
            fields: {
                [fieldName]: connectedNode,
                deletedRelationship: getRelationshipConnectionWhereTypes({
                    node,
                    schemaComposer,
                    relationshipFields,
                    interfaceCommonFields,
                }),
            },
        }),
    };
}
exports.generateSubscriptionConnectionWhereType = generateSubscriptionConnectionWhereType;
function getRelationshipConnectionWhereTypes({ node, schemaComposer, relationshipFields, interfaceCommonFields, }) {
    const { name, relationFields } = node;
    const relationsFieldInputWhereType = schemaComposer.getOrCreateITC(`${name}RelationshipsSubscriptionWhere`);
    relationFields.forEach((rf) => {
        const { fieldName } = rf;
        const nodeRelationPrefix = `${name}${(0, upper_first_1.upperFirst)(fieldName)}`;
        const relationFieldInputWhereType = schemaComposer.createInputTC({
            name: `${nodeRelationPrefix}RelationshipSubscriptionWhere`,
            fields: makeNodeRelationFields({
                relationField: rf,
                schemaComposer,
                interfaceCommonFields,
                relationshipFields,
                nodeRelationPrefix,
            }),
        });
        relationsFieldInputWhereType.addFields({
            [fieldName]: relationFieldInputWhereType,
        });
    });
    return relationsFieldInputWhereType;
}
function makeNodeRelationFields({ relationField, schemaComposer, interfaceCommonFields, relationshipFields, nodeRelationPrefix, }) {
    const edgeType = makeRelationshipWhereType({
        relationshipFields,
        schemaComposer,
        relationField,
    });
    const unionNodeTypes = relationField.union?.nodes;
    if (unionNodeTypes) {
        return makeRelationshipToUnionTypeWhereType({ unionNodeTypes, schemaComposer, nodeRelationPrefix, edgeType });
    }
    const interfaceNodeTypes = relationField.interface?.implementations;
    if (interfaceNodeTypes) {
        const interfaceNodeTypeName = relationField.typeMeta.name;
        const interfaceCommonFieldsOnImplementations = interfaceCommonFields.get(interfaceNodeTypeName);
        return makeRelationshipToInterfaceTypeWhereType({
            interfaceNodeTypeName,
            schemaComposer,
            interfaceNodeTypes,
            interfaceCommonFieldsOnImplementations,
            edgeType,
        });
    }
    return makeRelationshipToConcreteTypeWhereType({ relationField, edgeType });
}
function makeRelationshipWhereType({ relationshipFields, schemaComposer, relationField, }) {
    const relationProperties = relationshipFields.get(relationField.properties || "");
    if (!relationProperties) {
        return undefined;
    }
    return schemaComposer.getOrCreateITC(`${relationField.properties}SubscriptionWhere`, (tc) => tc.addFields((0, to_compose_1.objectFieldsToSubscriptionsWhereInputFields)(relationField.properties, [
        ...relationProperties.primitiveFields,
        ...relationProperties.enumFields,
        ...relationProperties.scalarFields,
        ...relationProperties.temporalFields,
    ])));
}
function makeRelationshipToConcreteTypeWhereType({ relationField, edgeType, }) {
    const nodeTypeName = relationField.typeMeta.name;
    return {
        node: `${nodeTypeName}SubscriptionWhere`,
        ...(edgeType && { edge: edgeType }),
    };
}
function makeRelationshipToUnionTypeWhereType({ unionNodeTypes, schemaComposer, nodeRelationPrefix, edgeType, }) {
    return unionNodeTypes.reduce((acc, concreteTypeName) => {
        acc[concreteTypeName] = schemaComposer.getOrCreateITC(`${nodeRelationPrefix}${concreteTypeName}SubscriptionWhere`, (tc) => tc.addFields({
            node: `${concreteTypeName}SubscriptionWhere`,
            ...(edgeType && { edge: edgeType }),
        }));
        return acc;
    }, {});
}
function makeRelationshipToInterfaceTypeWhereType({ interfaceNodeTypeName, schemaComposer, interfaceNodeTypes, interfaceCommonFieldsOnImplementations, edgeType, }) {
    const interfaceImplementationsType = schemaComposer.getOrCreateITC(`${interfaceNodeTypeName}ImplementationsSubscriptionWhere`, (tc) => tc.addFields(interfaceNodeTypes.reduce((acc, concreteTypeName) => {
        acc[concreteTypeName] = `${concreteTypeName}SubscriptionWhere`;
        return acc;
    }, {})));
    const interfaceNodeType = schemaComposer.getOrCreateITC(`${interfaceNodeTypeName}SubscriptionWhere`, (tc) => tc.addFields({
        _on: interfaceImplementationsType,
        ...(interfaceCommonFieldsOnImplementations &&
            (0, to_compose_1.objectFieldsToSubscriptionsWhereInputFields)(interfaceNodeTypeName, [
                ...interfaceCommonFieldsOnImplementations.primitiveFields,
                ...interfaceCommonFieldsOnImplementations.enumFields,
                ...interfaceCommonFieldsOnImplementations.scalarFields,
                ...interfaceCommonFieldsOnImplementations.temporalFields,
                ...interfaceCommonFieldsOnImplementations.pointFields,
            ])),
    }));
    return {
        node: interfaceNodeType,
        ...(edgeType && { edge: edgeType }),
    };
}
//# sourceMappingURL=generate-subscription-where-type.js.map