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
const create_projection_and_params_1 = __importDefault(require("./create-projection-and-params"));
const create_create_and_params_1 = __importDefault(require("./create-create-and-params"));
const create_update_and_params_1 = __importDefault(require("./create-update-and-params"));
const create_connect_and_params_1 = __importDefault(require("./create-connect-and-params"));
const create_disconnect_and_params_1 = __importDefault(require("./create-disconnect-and-params"));
const constants_1 = require("../constants");
const create_delete_and_params_1 = __importDefault(require("./create-delete-and-params"));
const create_set_relationship_properties_and_params_1 = __importDefault(require("./create-set-relationship-properties-and-params"));
const translate_top_level_match_1 = require("./translate-top-level-match");
const create_connect_or_create_and_params_1 = require("./create-connect-or-create-and-params");
const create_relationship_validation_string_1 = __importDefault(require("./create-relationship-validation-string"));
const CallbackBucket_1 = require("../classes/CallbackBucket");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_connection_event_meta_1 = require("../translate/subscriptions/create-connection-event-meta");
const filter_meta_variable_1 = require("../translate/subscriptions/filter-meta-variable");
async function translateUpdate({ node, context, }) {
    const { resolveTree } = context;
    const updateInput = resolveTree.args.update;
    const connectInput = resolveTree.args.connect;
    const disconnectInput = resolveTree.args.disconnect;
    const createInput = resolveTree.args.create;
    const deleteInput = resolveTree.args.delete;
    const connectOrCreateInput = resolveTree.args.connectOrCreate;
    const varName = "this";
    const callbackBucket = new CallbackBucket_1.CallbackBucket(context);
    const withVars = [varName];
    if (context.subscriptionsEnabled) {
        withVars.push(constants_1.META_CYPHER_VARIABLE);
    }
    let matchAndWhereStr = "";
    let updateStr = "";
    const connectStrs = [];
    const disconnectStrs = [];
    const createStrs = [];
    let deleteStr = "";
    let projAuth = "";
    let projStr = "";
    let cypherParams = context.cypherParams ? { cypherParams: context.cypherParams } : {};
    const assumeReconnecting = Boolean(connectInput) && Boolean(disconnectInput);
    const matchNode = new cypher_builder_1.default.NamedNode(varName, { labels: node.getLabels(context) });
    const topLevelMatch = (0, translate_top_level_match_1.translateTopLevelMatch)({ matchNode, node, context, operation: "UPDATE" });
    matchAndWhereStr = topLevelMatch.cypher;
    cypherParams = { ...cypherParams, ...topLevelMatch.params };
    const connectionStrs = [];
    const interfaceStrs = [];
    let updateArgs = {};
    const mutationResponse = resolveTree.fieldsByTypeName[node.mutationResponseTypeNames.update];
    const nodeProjection = Object.values(mutationResponse).find((field) => field.name === node.plural);
    if (updateInput) {
        const updateAndParams = (0, create_update_and_params_1.default)({
            context,
            callbackBucket,
            node,
            updateInput,
            varName,
            parentVar: varName,
            withVars,
            parameterPrefix: `${resolveTree.name}.args.update`,
            includeRelationshipValidation: true,
        });
        [updateStr] = updateAndParams;
        cypherParams = {
            ...cypherParams,
            ...updateAndParams[1],
        };
        updateArgs = {
            ...updateArgs,
            ...(updateStr.includes(resolveTree.name) ? { update: updateInput } : {}),
        };
    }
    if (disconnectInput) {
        Object.entries(disconnectInput).forEach((entry) => {
            const relationField = node.relationFields.find((x) => x.fieldName === entry[0]);
            const refNodes = [];
            if (relationField.union) {
                Object.keys(entry[1]).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface?.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            if (relationField.interface) {
                const disconnectAndParams = (0, create_disconnect_and_params_1.default)({
                    context,
                    parentVar: varName,
                    refNodes,
                    relationField,
                    value: entry[1],
                    varName: `${varName}_disconnect_${entry[0]}`,
                    withVars,
                    parentNode: node,
                    parameterPrefix: `${resolveTree.name}.args.disconnect.${entry[0]}`,
                    labelOverride: "",
                });
                disconnectStrs.push(disconnectAndParams[0]);
                cypherParams = { ...cypherParams, ...disconnectAndParams[1] };
            }
            else {
                refNodes.forEach((refNode) => {
                    const disconnectAndParams = (0, create_disconnect_and_params_1.default)({
                        context,
                        parentVar: varName,
                        refNodes: [refNode],
                        relationField,
                        value: relationField.union ? entry[1][refNode.name] : entry[1],
                        varName: `${varName}_disconnect_${entry[0]}${relationField.union ? `_${refNode.name}` : ""}`,
                        withVars,
                        parentNode: node,
                        parameterPrefix: `${resolveTree.name}.args.disconnect.${entry[0]}${relationField.union ? `.${refNode.name}` : ""}`,
                        labelOverride: relationField.union ? refNode.name : "",
                    });
                    disconnectStrs.push(disconnectAndParams[0]);
                    cypherParams = { ...cypherParams, ...disconnectAndParams[1] };
                });
            }
        });
        updateArgs = {
            ...updateArgs,
            disconnect: disconnectInput,
        };
    }
    if (connectInput) {
        Object.entries(connectInput).forEach((entry) => {
            const relationField = node.relationFields.find((x) => entry[0] === x.fieldName);
            const refNodes = [];
            if (relationField.union) {
                Object.keys(entry[1]).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface?.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            if (relationField.interface) {
                if (!relationField.typeMeta.array) {
                    const inStr = relationField.direction === "IN" ? "<-" : "-";
                    const outStr = relationField.direction === "OUT" ? "->" : "-";
                    refNodes.forEach((refNode) => {
                        const validateRelationshipExistance = `CALL apoc.util.validate(EXISTS((${varName})${inStr}[:${relationField.type}]${outStr}(:${refNode.name})),'Relationship field "%s.%s" cannot have more than one node linked',["${relationField.connectionPrefix}","${relationField.fieldName}"])`;
                        connectStrs.push(validateRelationshipExistance);
                    });
                }
                const connectAndParams = (0, create_connect_and_params_1.default)({
                    context,
                    callbackBucket,
                    parentVar: varName,
                    refNodes,
                    relationField,
                    value: entry[1],
                    varName: `${varName}_connect_${entry[0]}`,
                    withVars,
                    parentNode: node,
                    labelOverride: "",
                    includeRelationshipValidation: !!assumeReconnecting,
                });
                connectStrs.push(connectAndParams[0]);
                cypherParams = { ...cypherParams, ...connectAndParams[1] };
            }
            else {
                refNodes.forEach((refNode) => {
                    const connectAndParams = (0, create_connect_and_params_1.default)({
                        context,
                        callbackBucket,
                        parentVar: varName,
                        refNodes: [refNode],
                        relationField,
                        value: relationField.union ? entry[1][refNode.name] : entry[1],
                        varName: `${varName}_connect_${entry[0]}${relationField.union ? `_${refNode.name}` : ""}`,
                        withVars,
                        parentNode: node,
                        labelOverride: relationField.union ? refNode.name : "",
                    });
                    connectStrs.push(connectAndParams[0]);
                    cypherParams = { ...cypherParams, ...connectAndParams[1] };
                });
            }
        });
    }
    if (createInput) {
        Object.entries(createInput).forEach((entry) => {
            const relationField = node.relationFields.find((x) => entry[0] === x.fieldName);
            const refNodes = [];
            if (relationField.union) {
                Object.keys(entry[1]).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface?.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            const inStr = relationField.direction === "IN" ? "<-" : "-";
            const outStr = relationField.direction === "OUT" ? "->" : "-";
            refNodes.forEach((refNode) => {
                let v = relationField.union ? entry[1][refNode.name] : entry[1];
                if (relationField.interface) {
                    if (relationField.typeMeta.array) {
                        v = entry[1]
                            .filter((c) => Object.keys(c.node).includes(refNode.name))
                            .map((c) => ({ edge: c.edge, node: c.node[refNode.name] }));
                        if (!v.length) {
                            return;
                        }
                    }
                    else {
                        if (!entry[1].node[refNode.name]) {
                            return;
                        }
                        v = { edge: entry[1].edge, node: entry[1].node[refNode.name] };
                    }
                }
                const creates = relationField.typeMeta.array ? v : [v];
                creates.forEach((create, index) => {
                    const baseName = `${varName}_create_${entry[0]}${relationField.union || relationField.interface ? `_${refNode.name}` : ""}${index}`;
                    const nodeName = `${baseName}_node${relationField.interface ? `_${refNode.name}` : ""}`;
                    const propertiesName = `${baseName}_relationship`;
                    const relationVarName = relationField.properties || context.subscriptionsEnabled ? propertiesName : "";
                    const relTypeStr = `[${relationVarName}:${relationField.type}]`;
                    if (!relationField.typeMeta.array) {
                        const validateRelationshipExistance = `CALL apoc.util.validate(EXISTS((${varName})${inStr}[:${relationField.type}]${outStr}(:${refNode.name})),'Relationship field "%s.%s" cannot have more than one node linked',["${relationField.connectionPrefix}","${relationField.fieldName}"])`;
                        createStrs.push(validateRelationshipExistance);
                    }
                    const createAndParams = (0, create_create_and_params_1.default)({
                        context,
                        callbackBucket,
                        node: refNode,
                        input: create.node,
                        varName: nodeName,
                        withVars: [...withVars, nodeName],
                        includeRelationshipValidation: false,
                    });
                    createStrs.push(createAndParams[0]);
                    cypherParams = { ...cypherParams, ...createAndParams[1] };
                    createStrs.push(`MERGE (${varName})${inStr}${relTypeStr}${outStr}(${nodeName})`);
                    if (relationField.properties) {
                        const relationship = context.relationships.find((x) => x.properties === relationField.properties);
                        const setA = (0, create_set_relationship_properties_and_params_1.default)({
                            properties: create.edge ?? {},
                            varName: propertiesName,
                            relationship,
                            operation: "CREATE",
                            callbackBucket,
                        });
                        createStrs.push(setA[0]);
                        cypherParams = { ...cypherParams, ...setA[1] };
                    }
                    if (context.subscriptionsEnabled) {
                        const [fromVariable, toVariable] = relationField.direction === "IN" ? [nodeName, varName] : [varName, nodeName];
                        const [fromTypename, toTypename] = relationField.direction === "IN" ? [refNode.name, node.name] : [node.name, refNode.name];
                        const eventWithMetaStr = (0, create_connection_event_meta_1.createConnectionEventMeta)({
                            event: "create_relationship",
                            relVariable: propertiesName,
                            fromVariable,
                            toVariable,
                            typename: relationField.type,
                            fromTypename,
                            toTypename,
                        });
                        createStrs.push(`WITH ${eventWithMetaStr}, ${(0, filter_meta_variable_1.filterMetaVariable)([...withVars, nodeName]).join(", ")}`);
                    }
                });
            });
        });
    }
    if (deleteInput) {
        const deleteAndParams = (0, create_delete_and_params_1.default)({
            context,
            node,
            deleteInput,
            varName: `${varName}_delete`,
            parentVar: varName,
            withVars,
            parameterPrefix: `${resolveTree.name}.args.delete`,
        });
        [deleteStr] = deleteAndParams;
        cypherParams = {
            ...cypherParams,
            ...deleteAndParams[1],
        };
        updateArgs = {
            ...updateArgs,
            ...(deleteStr.includes(resolveTree.name) ? { delete: deleteInput } : {}),
        };
    }
    if (connectOrCreateInput) {
        Object.entries(connectOrCreateInput).forEach(([key, input]) => {
            const relationField = node.relationFields.find((x) => key === x.fieldName);
            const refNodes = [];
            if (relationField.union) {
                Object.keys(input).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface?.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            refNodes.forEach((refNode) => {
                const { cypher, params } = (0, create_connect_or_create_and_params_1.createConnectOrCreateAndParams)({
                    input: input[refNode.name] || input,
                    varName: `${varName}_connectOrCreate_${key}${relationField.union ? `_${refNode.name}` : ""}`,
                    parentVar: varName,
                    relationField,
                    refNode,
                    node,
                    context,
                    withVars,
                    callbackBucket,
                });
                connectStrs.push(cypher);
                cypherParams = { ...cypherParams, ...params };
            });
        });
    }
    let projectionSubquery;
    if (nodeProjection?.fieldsByTypeName) {
        const projection = (0, create_projection_and_params_1.default)({
            node,
            context,
            resolveTree: nodeProjection,
            varName,
        });
        projectionSubquery = cypher_builder_1.default.concat(...projection.subqueriesBeforeSort, ...projection.subqueries);
        projStr = projection.projection;
        cypherParams = { ...cypherParams, ...projection.params };
        if (projection.meta?.authValidateStrs?.length) {
            projAuth = `CALL apoc.util.validate(NOT (${projection.meta.authValidateStrs.join(" AND ")}), "${constants_1.AUTH_FORBIDDEN_ERROR}", [0])`;
        }
    }
    const returnStatement = generateUpdateReturnStatement(varName, projStr, context.subscriptionsEnabled);
    const relationshipValidationStr = !updateInput ? (0, create_relationship_validation_string_1.default)({ node, context, varName }) : "";
    const updateQuery = new cypher_builder_1.default.RawCypher((env) => {
        const projectionSubqueryStr = projectionSubquery ? projectionSubquery.getCypher(env) : "";
        const cypher = [
            ...(context.subscriptionsEnabled ? [`WITH [] AS ${constants_1.META_CYPHER_VARIABLE}`] : []),
            matchAndWhereStr,
            updateStr,
            connectStrs.join("\n"),
            disconnectStrs.join("\n"),
            createStrs.join("\n"),
            deleteStr,
            ...(deleteStr.length ||
                connectStrs.length ||
                disconnectStrs.length ||
                createStrs.length ||
                projectionSubqueryStr
                ? [`WITH *`]
                : []),
            projectionSubqueryStr,
            ...(connectionStrs.length || projAuth ? [`WITH *`] : []),
            ...(projAuth ? [projAuth] : []),
            ...(relationshipValidationStr ? [`WITH *`, relationshipValidationStr] : []),
            ...connectionStrs,
            ...interfaceStrs,
            ...(context.subscriptionsEnabled
                ? [
                    `WITH *`,
                    `UNWIND (CASE ${constants_1.META_CYPHER_VARIABLE} WHEN [] then [null] else ${constants_1.META_CYPHER_VARIABLE} end) AS m`,
                ]
                : []),
            returnStatement,
        ]
            .filter(Boolean)
            .join("\n");
        return [
            cypher,
            {
                ...cypherParams,
                ...(Object.keys(updateArgs).length ? { [resolveTree.name]: { args: updateArgs } } : {}),
            },
        ];
    });
    const result = updateQuery.build("update_");
    const { cypher, params: resolvedCallbacks } = await callbackBucket.resolveCallbacksAndFilterCypher({
        cypher: result.cypher,
    });
    return [cypher, { ...result.params, resolvedCallbacks }];
}
exports.default = translateUpdate;
function generateUpdateReturnStatement(varName, projStr, subscriptionsEnabled) {
    const statements = [];
    if (varName && projStr) {
        statements.push(`collect(DISTINCT ${varName} ${projStr}) AS data`);
    }
    if (subscriptionsEnabled) {
        statements.push(`collect(DISTINCT m) as ${constants_1.META_CYPHER_VARIABLE}`);
    }
    if (statements.length === 0) {
        statements.push("'Query cannot conclude with CALL'");
    }
    return `RETURN ${statements.join(", ")}`;
}
//# sourceMappingURL=translate-update.js.map