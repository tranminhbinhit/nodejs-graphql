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
exports.publishEventsToPlugin = void 0;
const neo4j_serializers_1 = require("../../utils/neo4j-serializers");
function publishEventsToPlugin(executeResult, plugin, schemaModel) {
    if (plugin) {
        const metadata = executeResult.records[0]?.meta || [];
        const serializedEvents = metadata.reduce(parseEvents(schemaModel), []);
        const serializedEventsWithoutDuplicates = removeDuplicateEvents(serializedEvents, "delete_relationship", "delete", "create_relationship");
        for (const subscriptionsEvent of serializedEventsWithoutDuplicates) {
            try {
                const publishPromise = plugin.publish(subscriptionsEvent); // Not using await to avoid blocking
                if (publishPromise) {
                    publishPromise.catch((error) => {
                        console.warn(error);
                    });
                }
            }
            catch (error) {
                console.warn(error);
            }
        }
    }
}
exports.publishEventsToPlugin = publishEventsToPlugin;
function parseEvents(schemaModel) {
    return function (events, event) {
        if (isNodeSubscriptionMeta(event)) {
            events.push(serializeNodeSubscriptionEvent(event));
        }
        if (isRelationshipSubscriptionMeta(event)) {
            if (isRelationshipWithTypenameSubscriptionMeta(event)) {
                events.push(serializeRelationshipSubscriptionEvent(event));
            }
            if (isRelationshipWithLabelsSubscriptionMeta(event)) {
                const fromTypenames = getTypenamesFromLabels({ labels: event.fromLabels, schemaModel });
                const toTypenames = getTypenamesFromLabels({ labels: event.toLabels, schemaModel });
                if (!fromTypenames || !toTypenames) {
                    return events;
                }
                for (const fromTypename of fromTypenames) {
                    for (const toTypename of toTypenames) {
                        events.push(serializeRelationshipSubscriptionEvent({ ...event, fromTypename, toTypename }));
                    }
                }
            }
        }
        return events;
    };
}
function removeDuplicateEvents(events, ...eventTypes) {
    const resultIdsByEventType = eventTypes.reduce((acc, eventType) => {
        acc.set(eventType, new Map());
        return acc;
    }, new Map());
    return events.reduce((result, event) => {
        if (!eventTypes.includes(event.event)) {
            result.push(event);
            return result;
        }
        const resultsIds = resultIdsByEventType.get(event.event);
        const publishedEventWithId = resultsIds.get(event.id);
        if (isEventAlreadyPublished(event, publishedEventWithId)) {
            return result;
        }
        resultsIds.set(event.id, (publishedEventWithId || []).concat({
            fromTypename: event["fromTypename"],
            toTypename: event["toTypename"],
        }));
        result.push(event);
        return result;
    }, []);
}
function isEventAlreadyPublished(event, publishedEventWithId) {
    if (!publishedEventWithId) {
        return false;
    }
    const typenamesAreRelevant = !!event["fromTypename"];
    if (!typenamesAreRelevant) {
        return true;
    }
    const publishedEventWithTypenames = publishedEventWithId?.find((typenames) => typenames.fromTypename === event["fromTypename"] && typenames.toTypename === event["toTypename"]);
    if (publishedEventWithTypenames) {
        return true;
    }
    return false;
}
function isNodeSubscriptionMeta(event) {
    return ["create", "update", "delete"].includes(event.event);
}
function isRelationshipSubscriptionMeta(event) {
    return ["create_relationship", "delete_relationship"].includes(event.event);
}
function isRelationshipWithTypenameSubscriptionMeta(event) {
    return !!event["toTypename"] && !!event["fromTypename"];
}
function isRelationshipWithLabelsSubscriptionMeta(event) {
    return !!event["toLabels"] && !!event["fromLabels"];
}
function serializeNodeSubscriptionEvent(event) {
    return {
        id: (0, neo4j_serializers_1.serializeNeo4jValue)(event.id),
        typename: event.typename,
        timestamp: (0, neo4j_serializers_1.serializeNeo4jValue)(event.timestamp),
        event: event.event,
        properties: {
            old: serializeProperties(event.properties.old),
            new: serializeProperties(event.properties.new),
        },
    };
}
function serializeRelationshipSubscriptionEvent(event) {
    return {
        id: (0, neo4j_serializers_1.serializeNeo4jValue)(event.id),
        id_from: (0, neo4j_serializers_1.serializeNeo4jValue)(event.id_from),
        id_to: (0, neo4j_serializers_1.serializeNeo4jValue)(event.id_to),
        relationshipName: event.relationshipName,
        fromTypename: (0, neo4j_serializers_1.serializeNeo4jValue)(event.fromTypename),
        toTypename: (0, neo4j_serializers_1.serializeNeo4jValue)(event.toTypename),
        timestamp: (0, neo4j_serializers_1.serializeNeo4jValue)(event.timestamp),
        event: event.event,
        properties: {
            from: serializeProperties(event.properties.from),
            to: serializeProperties(event.properties.to),
            relationship: serializeProperties(event.properties.relationship),
        },
    };
}
function getTypenamesFromLabels({ labels, schemaModel, }) {
    if (!labels || !labels.length) {
        // any node has at least one label
        return undefined;
    }
    return schemaModel.getEntitiesByLabels(labels).map((entity) => entity.name);
}
function serializeProperties(properties) {
    if (!properties) {
        return undefined;
    }
    return Object.entries(properties).reduce((serializedProps, [k, v]) => {
        serializedProps[k] = (0, neo4j_serializers_1.serializeNeo4jValue)(v);
        return serializedProps;
    }, {});
}
//# sourceMappingURL=publish-events-to-plugin.js.map