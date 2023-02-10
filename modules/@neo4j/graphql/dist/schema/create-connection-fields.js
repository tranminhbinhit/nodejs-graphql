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
const classes_1 = require("../classes");
const get_sortable_fields_1 = __importDefault(require("./get-sortable-fields"));
const directed_argument_1 = require("./directed-argument");
const pagination_1 = require("./pagination");
const to_compose_1 = require("./to-compose");
const constants_1 = require("./constants");
function createConnectionFields({ connectionFields, schemaComposer, composeNode, nodes, relationshipPropertyFields, }) {
    const relationships = [];
    const whereInput = schemaComposer.getITC(`${composeNode.getTypeName()}Where`);
    connectionFields.forEach((connectionField) => {
        const relationship = schemaComposer.getOrCreateOTC(connectionField.relationshipTypeName, (tc) => {
            tc.addFields({
                cursor: "String!",
                node: `${connectionField.relationship.typeMeta.name}!`,
            });
        });
        const deprecatedDirectives = (0, to_compose_1.graphqlDirectivesToCompose)(connectionField.otherDirectives.filter((directive) => directive.name.value === "deprecated"));
        const connectionWhereName = `${connectionField.typeMeta.name}Where`;
        const connectionWhere = schemaComposer.getOrCreateITC(connectionWhereName);
        if (!connectionField.relationship.union) {
            connectionWhere.addFields({
                AND: `[${connectionWhereName}!]`,
                OR: `[${connectionWhereName}!]`,
                NOT: connectionWhereName,
            });
        }
        const connection = schemaComposer.getOrCreateOTC(connectionField.typeMeta.name, (tc) => {
            tc.addFields({
                edges: relationship.NonNull.List.NonNull,
                totalCount: "Int!",
                pageInfo: "PageInfo!",
            });
        });
        if (connectionField.relationship.properties && !connectionField.relationship.union) {
            const propertiesInterface = schemaComposer.getIFTC(connectionField.relationship.properties);
            relationship.addInterface(propertiesInterface);
            relationship.addFields(propertiesInterface.getFields());
            connectionWhere.addFields({
                edge: `${connectionField.relationship.properties}Where`,
                edge_NOT: {
                    type: `${connectionField.relationship.properties}Where`,
                    directives: [constants_1.DEPRECATE_NOT],
                },
            });
        }
        whereInput.addFields({
            [connectionField.fieldName]: connectionWhere,
            [`${connectionField.fieldName}_NOT`]: {
                type: connectionWhere,
                directives: [
                    {
                        name: "deprecated",
                        args: {
                            reason: `Use \`${connectionField.fieldName}_NONE\` instead.`,
                        },
                    },
                ],
            },
        });
        // n..m Relationships
        if (connectionField.relationship.typeMeta.array) {
            // Add filters for each list predicate
            whereInput.addFields(["ALL", "NONE", "SINGLE", "SOME"].reduce((acc, filter) => ({
                ...acc,
                [`${connectionField.fieldName}_${filter}`]: {
                    type: connectionWhere,
                    directives: deprecatedDirectives,
                },
            }), {}));
            whereInput.setFieldDirectiveByName(connectionField.fieldName, "deprecated", {
                reason: `Use \`${connectionField.fieldName}_SOME\` instead.`,
            });
        }
        const composeNodeBaseArgs = {
            where: connectionWhere,
            first: {
                type: "Int",
            },
            after: {
                type: "String",
            },
        };
        const composeNodeArgs = (0, directed_argument_1.addDirectedArgument)(composeNodeBaseArgs, connectionField.relationship);
        if (connectionField.relationship.properties) {
            const connectionSort = schemaComposer.getOrCreateITC(`${connectionField.typeMeta.name}Sort`);
            connectionSort.addFields({
                edge: `${connectionField.relationship.properties}Sort`,
            });
            composeNodeArgs.sort = connectionSort.NonNull.List;
        }
        if (connectionField.relationship.interface) {
            connectionWhere.addFields({
                OR: connectionWhere.NonNull.List,
                AND: connectionWhere.NonNull.List,
                NOT: connectionWhereName,
                node: `${connectionField.relationship.typeMeta.name}Where`,
                node_NOT: {
                    type: `${connectionField.relationship.typeMeta.name}Where`,
                    directives: [constants_1.DEPRECATE_NOT],
                },
            });
            if (schemaComposer.has(`${connectionField.relationship.typeMeta.name}Sort`)) {
                const connectionSort = schemaComposer.getOrCreateITC(`${connectionField.typeMeta.name}Sort`);
                connectionSort.addFields({
                    node: `${connectionField.relationship.typeMeta.name}Sort`,
                });
                if (!composeNodeArgs.sort) {
                    composeNodeArgs.sort = connectionSort.NonNull.List;
                }
            }
            if (connectionField.relationship.properties) {
                const propertiesInterface = schemaComposer.getIFTC(connectionField.relationship.properties);
                relationship.addInterface(propertiesInterface);
                relationship.addFields(propertiesInterface.getFields());
                connectionWhere.addFields({
                    edge: `${connectionField.relationship.properties}Where`,
                    edge_NOT: {
                        type: `${connectionField.relationship.properties}Where`,
                        directives: [constants_1.DEPRECATE_NOT],
                    },
                });
            }
        }
        else if (connectionField.relationship.union) {
            const relatedNodes = nodes.filter((n) => connectionField.relationship.union?.nodes?.includes(n.name));
            relatedNodes.forEach((n) => {
                const connectionName = connectionField.typeMeta.name;
                // Append union member name before "ConnectionWhere"
                const unionWhereName = `${connectionName.substring(0, connectionName.length - "Connection".length)}${n.name}ConnectionWhere`;
                const unionWhere = schemaComposer.createInputTC({
                    name: unionWhereName,
                    fields: {
                        OR: `[${unionWhereName}!]`,
                        AND: `[${unionWhereName}!]`,
                        NOT: unionWhereName,
                    },
                });
                unionWhere.addFields({
                    node: `${n.name}Where`,
                    node_NOT: {
                        type: `${n.name}Where`,
                        directives: [constants_1.DEPRECATE_NOT],
                    },
                });
                if (connectionField.relationship.properties) {
                    const propertiesInterface = schemaComposer.getIFTC(connectionField.relationship.properties);
                    relationship.addInterface(propertiesInterface);
                    relationship.addFields(propertiesInterface.getFields());
                    unionWhere.addFields({
                        edge: `${connectionField.relationship.properties}Where`,
                        edge_NOT: {
                            type: `${connectionField.relationship.properties}Where`,
                            directives: [constants_1.DEPRECATE_NOT],
                        },
                    });
                }
                connectionWhere.addFields({
                    [n.name]: unionWhere,
                });
            });
        }
        else {
            const relatedNode = nodes.find((n) => n.name === connectionField.relationship.typeMeta.name);
            connectionWhere.addFields({
                node: `${connectionField.relationship.typeMeta.name}Where`,
                node_NOT: {
                    type: `${connectionField.relationship.typeMeta.name}Where`,
                    directives: [constants_1.DEPRECATE_NOT],
                },
            });
            if ((0, get_sortable_fields_1.default)(relatedNode).length) {
                const connectionSort = schemaComposer.getOrCreateITC(`${connectionField.typeMeta.name}Sort`);
                connectionSort.addFields({
                    node: `${connectionField.relationship.typeMeta.name}Sort`,
                });
                if (!composeNodeArgs.sort) {
                    composeNodeArgs.sort = connectionSort.NonNull.List;
                }
            }
        }
        if (!connectionField.relationship.writeonly) {
            const deprecatedDirectives = (0, to_compose_1.graphqlDirectivesToCompose)(connectionField.otherDirectives.filter((directive) => directive.name.value === "deprecated"));
            composeNode.addFields({
                [connectionField.fieldName]: {
                    type: connection.NonNull,
                    args: composeNodeArgs,
                    directives: deprecatedDirectives,
                    resolve: (source, args, _ctx, info) => {
                        return (0, pagination_1.connectionFieldResolver)({
                            connectionField,
                            args,
                            info,
                            source,
                        });
                    },
                },
            });
        }
        const relFields = connectionField.relationship.properties
            ? relationshipPropertyFields.get(connectionField.relationship.properties)
            : {};
        const r = new classes_1.Relationship({
            name: connectionField.relationshipTypeName,
            type: connectionField.relationship.type,
            properties: connectionField.relationship.properties,
            ...(relFields
                ? {
                    temporalFields: relFields.temporalFields,
                    scalarFields: relFields.scalarFields,
                    primitiveFields: relFields.primitiveFields,
                    enumFields: relFields.enumFields,
                    pointFields: relFields.pointFields,
                    customResolverFields: relFields.customResolverFields,
                }
                : {}),
        });
        relationships.push(r);
    });
    return relationships;
}
exports.default = createConnectionFields;
//# sourceMappingURL=create-connection-fields.js.map