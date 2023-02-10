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
exports.generateSubscriptionTypes = void 0;
const graphql_1 = require("graphql");
const EventType_1 = require("../../graphql/enums/EventType");
const generate_subscription_where_type_1 = require("./generate-subscription-where-type");
const generate_event_payload_type_1 = require("./generate-event-payload-type");
const subscribe_1 = require("../resolvers/subscriptions/subscribe");
const generate_subscription_connection_types_1 = require("./generate-subscription-connection-types");
function generateSubscriptionTypes({ schemaComposer, nodes, relationshipFields, interfaceCommonFields, }) {
    const subscriptionComposer = schemaComposer.Subscription;
    const eventTypeEnum = schemaComposer.createEnumTC(EventType_1.EventType);
    const shouldIncludeSubscriptionOperation = (node) => !node.exclude?.operations.includes("subscribe");
    const nodesWithSubscriptionOperation = nodes.filter(shouldIncludeSubscriptionOperation);
    const nodeNameToEventPayloadTypes = nodesWithSubscriptionOperation.reduce((acc, node) => {
        acc[node.name] = (0, generate_event_payload_type_1.generateEventPayloadType)(node, schemaComposer);
        return acc;
    }, {});
    const nodeToRelationFieldMap = new Map();
    nodesWithSubscriptionOperation.forEach((node) => {
        const eventPayload = nodeNameToEventPayloadTypes[node.name];
        const where = (0, generate_subscription_where_type_1.generateSubscriptionWhereType)(node, schemaComposer);
        const { subscriptionEventTypeNames, subscriptionEventPayloadFieldNames, rootTypeFieldNames } = node;
        const { subscribe: subscribeOperation } = rootTypeFieldNames;
        const nodeCreatedEvent = schemaComposer.createObjectTC({
            name: subscriptionEventTypeNames.create,
            fields: {
                event: {
                    type: eventTypeEnum.NonNull,
                    resolve: () => EventType_1.EventType.getValue("CREATE")?.value,
                },
                timestamp: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
                    resolve: (source) => source.timestamp,
                },
            },
        });
        const nodeUpdatedEvent = schemaComposer.createObjectTC({
            name: subscriptionEventTypeNames.update,
            fields: {
                event: {
                    type: eventTypeEnum.NonNull,
                    resolve: () => EventType_1.EventType.getValue("UPDATE")?.value,
                },
                timestamp: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
                    resolve: (source) => source.timestamp,
                },
            },
        });
        const nodeDeletedEvent = schemaComposer.createObjectTC({
            name: subscriptionEventTypeNames.delete,
            fields: {
                event: {
                    type: eventTypeEnum.NonNull,
                    resolve: () => EventType_1.EventType.getValue("DELETE")?.value,
                },
                timestamp: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
                    resolve: (source) => source.timestamp,
                },
            },
        });
        const relationshipCreatedEvent = schemaComposer.createObjectTC({
            name: subscriptionEventTypeNames.create_relationship,
            fields: {
                event: {
                    type: eventTypeEnum.NonNull,
                    resolve: () => EventType_1.EventType.getValue("CREATE_RELATIONSHIP")?.value,
                },
                timestamp: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
                    resolve: (source) => source.timestamp,
                },
            },
        });
        const relationshipDeletedEvent = schemaComposer.createObjectTC({
            name: subscriptionEventTypeNames.delete_relationship,
            fields: {
                event: {
                    type: eventTypeEnum.NonNull,
                    resolve: () => EventType_1.EventType.getValue("DELETE_RELATIONSHIP")?.value,
                },
                timestamp: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
                    resolve: (source) => source.timestamp,
                },
            },
        });
        const connectedTypes = (0, generate_subscription_connection_types_1.getConnectedTypes)({
            node,
            relationshipFields,
            interfaceCommonFields,
            schemaComposer,
            nodeNameToEventPayloadTypes,
        });
        const relationsEventPayload = schemaComposer.createObjectTC({
            name: `${node.name}ConnectedRelationships`,
            fields: connectedTypes,
        });
        if ((0, generate_subscription_connection_types_1.hasProperties)(eventPayload)) {
            nodeCreatedEvent.addFields({
                [subscriptionEventPayloadFieldNames.create]: {
                    type: eventPayload.NonNull,
                    resolve: (source) => source.properties.new,
                },
            });
            nodeUpdatedEvent.addFields({
                previousState: {
                    type: eventPayload.NonNull,
                    resolve: (source) => source.properties.old,
                },
                [subscriptionEventPayloadFieldNames.update]: {
                    type: eventPayload.NonNull,
                    resolve: (source) => source.properties.new,
                },
            });
            nodeDeletedEvent.addFields({
                [subscriptionEventPayloadFieldNames.delete]: {
                    type: eventPayload.NonNull,
                    resolve: (source) => source.properties.old,
                },
            });
            relationshipCreatedEvent.addFields({
                [subscriptionEventPayloadFieldNames.create_relationship]: {
                    type: eventPayload.NonNull,
                    resolve: (source) => {
                        return getRelationshipEventDataForNode(source, node, nodeToRelationFieldMap).properties;
                    },
                },
                relationshipFieldName: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                    resolve: (source) => {
                        return getRelationField({
                            node,
                            relationshipName: source.relationshipName,
                            nodeToRelationFieldMap,
                        })?.fieldName;
                    },
                },
            });
            relationshipDeletedEvent.addFields({
                [subscriptionEventPayloadFieldNames.delete_relationship]: {
                    type: eventPayload.NonNull,
                    resolve: (source) => {
                        return getRelationshipEventDataForNode(source, node, nodeToRelationFieldMap).properties;
                    },
                },
                relationshipFieldName: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                    resolve: (source) => {
                        return getRelationField({
                            node,
                            relationshipName: source.relationshipName,
                            nodeToRelationFieldMap,
                        })?.fieldName;
                    },
                },
            });
        }
        if ((0, generate_subscription_connection_types_1.hasProperties)(relationsEventPayload)) {
            const resolveRelationship = (source) => {
                const thisRel = getRelationField({
                    node,
                    relationshipName: source.relationshipName,
                    nodeToRelationFieldMap,
                });
                const { destinationProperties: props, destinationTypename: typename } = getRelationshipEventDataForNode(source, node, nodeToRelationFieldMap);
                return {
                    [thisRel.fieldName]: {
                        ...source.properties.relationship,
                        node: {
                            ...props,
                            __typename: `${typename}EventPayload`,
                        },
                    },
                };
            };
            relationshipCreatedEvent.addFields({
                createdRelationship: {
                    type: relationsEventPayload.NonNull,
                    resolve: resolveRelationship,
                },
            });
            relationshipDeletedEvent.addFields({
                deletedRelationship: {
                    type: relationsEventPayload.NonNull,
                    resolve: resolveRelationship,
                },
            });
        }
        subscriptionComposer.addFields({
            [subscribeOperation.created]: {
                args: { where },
                type: nodeCreatedEvent.NonNull,
                subscribe: (0, subscribe_1.generateSubscribeMethod)({ node, type: "create" }),
                resolve: subscribe_1.subscriptionResolve,
            },
            [subscribeOperation.updated]: {
                args: { where },
                type: nodeUpdatedEvent.NonNull,
                subscribe: (0, subscribe_1.generateSubscribeMethod)({ node, type: "update" }),
                resolve: subscribe_1.subscriptionResolve,
            },
            [subscribeOperation.deleted]: {
                args: { where },
                type: nodeDeletedEvent.NonNull,
                subscribe: (0, subscribe_1.generateSubscribeMethod)({ node, type: "delete" }),
                resolve: subscribe_1.subscriptionResolve,
            },
        });
        const { created: createdWhere, deleted: deletedWhere } = (0, generate_subscription_where_type_1.generateSubscriptionConnectionWhereType)({
            node,
            schemaComposer,
            relationshipFields,
            interfaceCommonFields,
        });
        if (node.relationFields.length > 0) {
            subscriptionComposer.addFields({
                [subscribeOperation.relationship_created]: {
                    args: { where: createdWhere },
                    type: relationshipCreatedEvent.NonNull,
                    subscribe: (0, subscribe_1.generateSubscribeMethod)({
                        node,
                        type: "create_relationship",
                        nodes,
                        relationshipFields,
                    }),
                    resolve: subscribe_1.subscriptionResolve,
                },
                [subscribeOperation.relationship_deleted]: {
                    args: { where: deletedWhere },
                    type: relationshipDeletedEvent.NonNull,
                    subscribe: (0, subscribe_1.generateSubscribeMethod)({
                        node,
                        type: "delete_relationship",
                        nodes,
                        relationshipFields,
                    }),
                    resolve: subscribe_1.subscriptionResolve,
                },
            });
        }
    });
}
exports.generateSubscriptionTypes = generateSubscriptionTypes;
function getRelationshipEventDataForNode(event, node, nodeToRelationFieldMap) {
    let condition = event.toTypename === node.name;
    if (event.toTypename === event.fromTypename) {
        // must check relationship direction from schema
        const { direction } = getRelationField({
            node,
            relationshipName: event.relationshipName,
            nodeToRelationFieldMap,
        });
        condition = direction === "IN";
    }
    if (condition) {
        return {
            direction: "IN",
            properties: event.properties.to,
            destinationProperties: event.properties.from,
            destinationTypename: event.fromTypename,
        };
    }
    return {
        direction: "OUT",
        properties: event.properties.from,
        destinationProperties: event.properties.to,
        destinationTypename: event.toTypename,
    };
}
function getRelationField({ node, relationshipName, nodeToRelationFieldMap, }) {
    // TODO: move to schemaModel intermediate representation
    let relationshipNameToRelationField;
    if (!nodeToRelationFieldMap.has(node)) {
        relationshipNameToRelationField = new Map();
        nodeToRelationFieldMap.set(node, relationshipNameToRelationField);
    }
    else {
        relationshipNameToRelationField = nodeToRelationFieldMap.get(node);
    }
    if (!relationshipNameToRelationField.has(relationshipName)) {
        const relationField = node.relationFields.find((f) => f.type === relationshipName);
        relationshipNameToRelationField.set(relationshipName, relationField);
    }
    return relationshipNameToRelationField.get(relationshipName);
}
//# sourceMappingURL=generate-subscription-types.js.map