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
exports.getConnectedTypes = exports.hasProperties = void 0;
const to_compose_1 = require("../to-compose");
const upper_first_1 = require("../../utils/upper-first");
function buildRelationshipDestinationUnionNodeType({ unionNodes, relationNodeTypeName, schemaComposer, }) {
    const atLeastOneTypeHasProperties = unionNodes.filter(hasProperties).length;
    if (!atLeastOneTypeHasProperties) {
        return null;
    }
    return schemaComposer.createUnionTC({
        name: `${relationNodeTypeName}EventPayload`,
        types: unionNodes,
    });
}
function buildRelationshipDestinationInterfaceNodeType({ relevantInterface, interfaceNodes, relationNodeTypeName, schemaComposer, }) {
    const allFields = Object.values(relevantInterface).reduce((acc, x) => [...acc, ...x], []);
    const connectionFields = [...relevantInterface.relationFields, ...relevantInterface.connectionFields];
    const [interfaceComposeFields, interfaceConnectionComposeFields] = [allFields, connectionFields].map(to_compose_1.objectFieldsToComposeFields);
    const nodeTo = schemaComposer.createInterfaceTC({
        name: `${relationNodeTypeName}EventPayload`,
        fields: interfaceComposeFields,
    });
    interfaceNodes?.forEach((interfaceNodeType) => {
        nodeTo.addTypeResolver(interfaceNodeType, () => true);
        interfaceNodeType.addFields(interfaceConnectionComposeFields);
    });
    return nodeTo;
}
function buildRelationshipDestinationAbstractType({ relationField, relationNodeTypeName, interfaceCommonFields, schemaComposer, nodeNameToEventPayloadTypes, }) {
    const unionNodeTypes = relationField.union?.nodes;
    if (unionNodeTypes) {
        const unionNodes = unionNodeTypes?.map((typeName) => nodeNameToEventPayloadTypes[typeName]);
        return buildRelationshipDestinationUnionNodeType({ unionNodes, relationNodeTypeName, schemaComposer });
    }
    const interfaceNodeTypeNames = relationField.interface?.implementations;
    if (interfaceNodeTypeNames) {
        const relevantInterfaceFields = interfaceCommonFields.get(relationNodeTypeName) || {};
        const interfaceNodes = interfaceNodeTypeNames.map((name) => nodeNameToEventPayloadTypes[name]);
        return buildRelationshipDestinationInterfaceNodeType({
            schemaComposer,
            relevantInterface: relevantInterfaceFields,
            interfaceNodes,
            relationNodeTypeName,
        });
    }
    return undefined;
}
function buildRelationshipFieldDestinationTypes({ relationField, interfaceCommonFields, schemaComposer, nodeNameToEventPayloadTypes, }) {
    const relationNodeTypeName = relationField.typeMeta.name;
    const nodeTo = nodeNameToEventPayloadTypes[relationNodeTypeName];
    if (nodeTo) {
        // standard type
        return hasProperties(nodeTo) && nodeTo;
    }
    // union/interface type
    return buildRelationshipDestinationAbstractType({
        relationField,
        relationNodeTypeName,
        interfaceCommonFields,
        schemaComposer,
        nodeNameToEventPayloadTypes,
    });
}
function getRelationshipFields({ relationField, relationshipFields, }) {
    const relationshipProperties = relationshipFields.get(relationField.properties || "");
    if (relationshipProperties) {
        return [
            ...relationshipProperties.primitiveFields,
            ...relationshipProperties.enumFields,
            ...relationshipProperties.scalarFields,
            ...relationshipProperties.temporalFields,
            ...relationshipProperties.pointFields,
        ];
    }
}
function hasProperties(x) {
    return !!Object.keys(x.getFields()).length;
}
exports.hasProperties = hasProperties;
function getConnectedTypes({ node, relationshipFields, interfaceCommonFields, schemaComposer, nodeNameToEventPayloadTypes, }) {
    const { name, relationFields } = node;
    return relationFields
        .map((relationField) => {
        const fieldName = relationField.fieldName;
        const relationshipFieldType = schemaComposer.createObjectTC({
            name: `${name}${(0, upper_first_1.upperFirst)(fieldName)}ConnectedRelationship`,
        });
        const edgeProps = getRelationshipFields({ relationField, relationshipFields });
        if (edgeProps) {
            relationshipFieldType.addFields((0, to_compose_1.objectFieldsToComposeFields)(edgeProps));
        }
        const nodeTo = buildRelationshipFieldDestinationTypes({
            relationField,
            interfaceCommonFields,
            schemaComposer,
            nodeNameToEventPayloadTypes,
        });
        if (nodeTo) {
            relationshipFieldType.addFields({ node: nodeTo.getTypeNonNull() });
        }
        return {
            relationshipFieldType,
            fieldName,
        };
    })
        .reduce((acc, { relationshipFieldType, fieldName }) => {
        if (relationshipFieldType && hasProperties(relationshipFieldType)) {
            acc[fieldName] = relationshipFieldType;
        }
        return acc;
    }, {});
}
exports.getConnectedTypes = getConnectedTypes;
//# sourceMappingURL=generate-subscription-connection-types.js.map