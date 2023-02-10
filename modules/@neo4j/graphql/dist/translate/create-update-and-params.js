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
const pluralize_1 = __importDefault(require("pluralize"));
const classes_1 = require("../classes");
const create_connect_and_params_1 = __importDefault(require("./create-connect-and-params"));
const create_disconnect_and_params_1 = __importDefault(require("./create-disconnect-and-params"));
const create_create_and_params_1 = __importDefault(require("./create-create-and-params"));
const constants_1 = require("../constants");
const create_delete_and_params_1 = __importDefault(require("./create-delete-and-params"));
const create_auth_and_params_1 = require("./create-auth-and-params");
const create_set_relationship_properties_1 = __importDefault(require("./create-set-relationship-properties"));
const create_connection_where_and_params_1 = __importDefault(require("./where/create-connection-where-and-params"));
const map_to_db_property_1 = __importDefault(require("../utils/map-to-db-property"));
const create_connect_or_create_and_params_1 = require("./create-connect-or-create-and-params");
const create_relationship_validation_string_1 = __importDefault(require("./create-relationship-validation-string"));
const create_event_meta_1 = require("./subscriptions/create-event-meta");
const create_connection_event_meta_1 = require("./subscriptions/create-connection-event-meta");
const filter_meta_variable_1 = require("./subscriptions/filter-meta-variable");
const callback_utils_1 = require("./utils/callback-utils");
const math_1 = require("./utils/math");
const indent_block_1 = require("./utils/indent-block");
const wrap_string_in_apostrophes_1 = require("../utils/wrap-string-in-apostrophes");
const is_property_clash_1 = require("../utils/is-property-clash");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const case_where_1 = require("../utils/case-where");
function createUpdateAndParams({ updateInput, varName, node, parentVar, chainStr, withVars, context, callbackBucket, parameterPrefix, includeRelationshipValidation, }) {
    let hasAppliedTimeStamps = false;
    const conflictingProperties = (0, is_property_clash_1.findConflictingProperties)({ node, input: updateInput });
    if (conflictingProperties.length > 0) {
        throw new classes_1.Neo4jGraphQLError(`Conflicting modification of ${conflictingProperties.map((n) => `[[${n}]]`).join(", ")} on type ${node.name}`);
    }
    function reducer(res, [key, value]) {
        let param;
        if (chainStr) {
            param = `${chainStr}_${key}`;
        }
        else {
            param = `${parentVar}_update_${key}`;
        }
        const relationField = node.relationFields.find((x) => key === x.fieldName);
        const pointField = node.pointFields.find((x) => key === x.fieldName);
        const dbFieldName = (0, map_to_db_property_1.default)(node, key);
        if (relationField) {
            const refNodes = [];
            const relationship = context.relationships.find((x) => x.properties === relationField.properties);
            if (relationField.union) {
                Object.keys(value).forEach((unionTypeName) => {
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
            const subqueries = [];
            const intermediateWithMetaStatements = [];
            refNodes.forEach((refNode, idx) => {
                const v = relationField.union ? value[refNode.name] : value;
                const updates = relationField.typeMeta.array ? v : [v];
                const subquery = [];
                let returnMetaStatement = "";
                updates.forEach((update, index) => {
                    const relationshipVariable = `${varName}_${relationField.type.toLowerCase()}${index}_relationship`;
                    const relTypeStr = `[${relationshipVariable}:${relationField.type}]`;
                    const variableName = `${varName}_${key}${relationField.union ? `_${refNode.name}` : ""}${index}`;
                    if (update.update) {
                        const whereStrs = [];
                        const delayedSubquery = [];
                        let aggregationWhere = false;
                        if (update.where) {
                            try {
                                const { cypher: whereClause, subquery: preComputedSubqueries, params: whereParams, } = (0, create_connection_where_and_params_1.default)({
                                    whereInput: update.where,
                                    node: refNode,
                                    nodeVariable: variableName,
                                    relationship,
                                    relationshipVariable,
                                    context,
                                    parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ``}.where`,
                                });
                                if (whereClause) {
                                    whereStrs.push(whereClause);
                                    res.params = { ...res.params, ...whereParams };
                                    if (preComputedSubqueries) {
                                        delayedSubquery.push(preComputedSubqueries);
                                        aggregationWhere = true;
                                    }
                                }
                            }
                            catch {
                                return;
                            }
                        }
                        const innerUpdate = [];
                        if (withVars) {
                            innerUpdate.push(`WITH ${withVars.join(", ")}`);
                        }
                        const labels = refNode.getLabelString(context);
                        innerUpdate.push(`MATCH (${parentVar})${inStr}${relTypeStr}${outStr}(${variableName}${labels})`);
                        innerUpdate.push(...delayedSubquery);
                        if (node.auth) {
                            const whereAuth = (0, create_auth_and_params_1.createAuthAndParams)({
                                operations: "UPDATE",
                                entity: refNode,
                                context,
                                where: { varName: variableName, node: refNode },
                            });
                            if (whereAuth[0]) {
                                whereStrs.push(whereAuth[0]);
                                res.params = { ...res.params, ...whereAuth[1] };
                            }
                        }
                        if (whereStrs.length) {
                            const predicate = `${whereStrs.join(" AND ")}`;
                            if (aggregationWhere) {
                                const columns = [
                                    new cypher_builder_1.default.NamedVariable(relationshipVariable),
                                    new cypher_builder_1.default.NamedVariable(variableName),
                                ];
                                const caseWhereClause = (0, case_where_1.caseWhere)(new cypher_builder_1.default.RawCypher(predicate), columns);
                                const { cypher } = caseWhereClause.build("aggregateWhereFilter");
                                innerUpdate.push(cypher);
                            }
                            else {
                                innerUpdate.push(`WHERE ${predicate}`);
                            }
                        }
                        if (update.update.edge) {
                            const setProperties = (0, create_set_relationship_properties_1.default)({
                                properties: update.update.edge,
                                varName: relationshipVariable,
                                withVars: withVars,
                                relationship,
                                callbackBucket,
                                operation: "UPDATE",
                                parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ``}.update.edge`,
                            });
                            innerUpdate.push(setProperties);
                        }
                        if (update.update.node) {
                            const nestedWithVars = [...withVars, variableName];
                            const nestedUpdateInput = Object.entries(update.update.node)
                                .filter(([k]) => {
                                if (k === "_on") {
                                    return false;
                                }
                                if (relationField.interface && update.update.node?._on?.[refNode.name]) {
                                    const onArray = Array.isArray(update.update.node._on[refNode.name])
                                        ? update.update.node._on[refNode.name]
                                        : [update.update.node._on[refNode.name]];
                                    if (onArray.some((onKey) => Object.prototype.hasOwnProperty.call(onKey, k))) {
                                        return false;
                                    }
                                }
                                return true;
                            })
                                .reduce((d1, [k1, v1]) => ({ ...d1, [k1]: v1 }), {});
                            const updateAndParams = createUpdateAndParams({
                                context,
                                callbackBucket,
                                node: refNode,
                                updateInput: nestedUpdateInput,
                                varName: variableName,
                                withVars: nestedWithVars,
                                parentVar: variableName,
                                chainStr: `${param}${relationField.union ? `_${refNode.name}` : ""}${index}`,
                                parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ``}.update.node`,
                                includeRelationshipValidation: true,
                            });
                            res.params = { ...res.params, ...updateAndParams[1] };
                            innerUpdate.push(updateAndParams[0]);
                            if (relationField.interface && update.update.node?._on?.[refNode.name]) {
                                const onUpdateAndParams = createUpdateAndParams({
                                    context,
                                    callbackBucket,
                                    node: refNode,
                                    updateInput: update.update.node._on[refNode.name],
                                    varName: variableName,
                                    withVars: nestedWithVars,
                                    parentVar: variableName,
                                    chainStr: `${param}${relationField.union ? `_${refNode.name}` : ""}${index}_on_${refNode.name}`,
                                    parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ``}.update.node._on.${refNode.name}`,
                                });
                                res.params = { ...res.params, ...onUpdateAndParams[1] };
                                innerUpdate.push(onUpdateAndParams[0]);
                            }
                        }
                        if (context.subscriptionsEnabled) {
                            innerUpdate.push(`RETURN collect(${constants_1.META_CYPHER_VARIABLE}) as update_meta`);
                            returnMetaStatement = `meta AS update${idx}_meta`;
                            intermediateWithMetaStatements.push(`WITH *, update${idx}_meta AS meta`);
                        }
                        else {
                            innerUpdate.push(`RETURN count(*) AS update_${variableName}`);
                        }
                        subquery.push(`WITH ${withVars.join(", ")}`, "CALL {", (0, indent_block_1.indentBlock)(innerUpdate.join("\n")), "}");
                        if (context.subscriptionsEnabled) {
                            const reduceMeta = `REDUCE(m=${constants_1.META_CYPHER_VARIABLE}, n IN update_meta | m + n) AS ${constants_1.META_CYPHER_VARIABLE}`;
                            subquery.push(`WITH ${(0, filter_meta_variable_1.filterMetaVariable)(withVars).join(", ")}, ${reduceMeta}`);
                        }
                    }
                    if (update.disconnect) {
                        const disconnectAndParams = (0, create_disconnect_and_params_1.default)({
                            context,
                            refNodes: [refNode],
                            value: update.disconnect,
                            varName: `${variableName}_disconnect`,
                            withVars,
                            parentVar,
                            relationField,
                            labelOverride: relationField.union ? refNode.name : "",
                            parentNode: node,
                            parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ""}.disconnect`,
                        });
                        subquery.push(disconnectAndParams[0]);
                        res.params = { ...res.params, ...disconnectAndParams[1] };
                    }
                    if (update.connect) {
                        const connectAndParams = (0, create_connect_and_params_1.default)({
                            context,
                            callbackBucket,
                            refNodes: [refNode],
                            value: update.connect,
                            varName: `${variableName}_connect`,
                            withVars,
                            parentVar,
                            relationField,
                            labelOverride: relationField.union ? refNode.name : "",
                            parentNode: node,
                        });
                        subquery.push(connectAndParams[0]);
                        if (context.subscriptionsEnabled) {
                            returnMetaStatement = `meta AS update${idx}_meta`;
                            intermediateWithMetaStatements.push(`WITH *, update${idx}_meta AS meta`);
                        }
                        res.params = { ...res.params, ...connectAndParams[1] };
                    }
                    if (update.connectOrCreate) {
                        const { cypher, params } = (0, create_connect_or_create_and_params_1.createConnectOrCreateAndParams)({
                            input: update.connectOrCreate,
                            varName: `${variableName}_connectOrCreate`,
                            parentVar: varName,
                            relationField,
                            refNode,
                            node,
                            context,
                            withVars,
                            callbackBucket,
                        });
                        subquery.push(cypher);
                        res.params = { ...res.params, ...params };
                    }
                    if (update.delete) {
                        const innerVarName = `${variableName}_delete`;
                        const deleteAndParams = (0, create_delete_and_params_1.default)({
                            context,
                            node,
                            deleteInput: { [key]: update.delete },
                            varName: innerVarName,
                            chainStr: innerVarName,
                            parentVar,
                            withVars,
                            parameterPrefix: `${parameterPrefix}.${key}${relationField.typeMeta.array ? `[${index}]` : ``}.delete`,
                            recursing: true,
                        });
                        subquery.push(deleteAndParams[0]);
                        res.params = { ...res.params, ...deleteAndParams[1] };
                    }
                    if (update.create) {
                        if (withVars) {
                            subquery.push(`WITH ${withVars.join(", ")}`);
                        }
                        const creates = relationField.typeMeta.array ? update.create : [update.create];
                        creates.forEach((create, i) => {
                            const baseName = `${variableName}_create${i}`;
                            const nodeName = `${baseName}_node`;
                            const propertiesName = `${baseName}_relationship`;
                            let createNodeInput = {
                                input: create.node,
                            };
                            if (relationField.interface) {
                                const nodeFields = create.node[refNode.name];
                                if (!nodeFields)
                                    return; // Interface specific type not defined
                                createNodeInput = {
                                    input: nodeFields,
                                };
                            }
                            const createAndParams = (0, create_create_and_params_1.default)({
                                context,
                                node: refNode,
                                callbackBucket,
                                varName: nodeName,
                                withVars: [...withVars, nodeName],
                                includeRelationshipValidation: false,
                                ...createNodeInput,
                            });
                            subquery.push(createAndParams[0]);
                            res.params = { ...res.params, ...createAndParams[1] };
                            const relationVarName = create.edge || context.subscriptionsEnabled ? propertiesName : "";
                            subquery.push(`MERGE (${parentVar})${inStr}[${relationVarName}:${relationField.type}]${outStr}(${nodeName})`);
                            if (create.edge) {
                                const setA = (0, create_set_relationship_properties_1.default)({
                                    properties: create.edge,
                                    varName: propertiesName,
                                    withVars,
                                    relationship,
                                    callbackBucket,
                                    operation: "CREATE",
                                    parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}[${index}].create[${i}].edge`,
                                });
                                subquery.push(setA);
                            }
                            if (context.subscriptionsEnabled) {
                                const [fromVariable, toVariable] = relationField.direction === "IN" ? [nodeName, varName] : [varName, nodeName];
                                const [fromTypename, toTypename] = relationField.direction === "IN"
                                    ? [refNode.name, node.name]
                                    : [node.name, refNode.name];
                                const eventWithMetaStr = (0, create_connection_event_meta_1.createConnectionEventMeta)({
                                    event: "create_relationship",
                                    relVariable: propertiesName,
                                    fromVariable,
                                    toVariable,
                                    typename: relationField.type,
                                    fromTypename,
                                    toTypename,
                                });
                                subquery.push(`WITH ${eventWithMetaStr}, ${(0, filter_meta_variable_1.filterMetaVariable)([...withVars, nodeName]).join(", ")}`);
                                returnMetaStatement = `meta AS update${idx}_meta`;
                                intermediateWithMetaStatements.push(`WITH *, update${idx}_meta AS meta`);
                            }
                            const relationshipValidationStr = (0, create_relationship_validation_string_1.default)({
                                node: refNode,
                                context,
                                varName: nodeName,
                            });
                            if (relationshipValidationStr) {
                                subquery.push(`WITH ${[...withVars, nodeName].join(", ")}`);
                                subquery.push(relationshipValidationStr);
                            }
                        });
                    }
                    if (relationField.interface) {
                        const returnStatement = `RETURN count(*) AS update_${varName}_${refNode.name}`;
                        if (context.subscriptionsEnabled && returnMetaStatement) {
                            subquery.push(`${returnStatement}, ${returnMetaStatement}`);
                        }
                        else {
                            subquery.push(returnStatement);
                        }
                    }
                });
                if (subquery.length) {
                    subqueries.push(subquery.join("\n"));
                }
            });
            if (relationField.interface) {
                res.strs.push(`WITH ${withVars.join(", ")}`);
                res.strs.push(`CALL {\n\t WITH ${withVars.join(", ")}\n\t`);
                const subqueriesWithMetaPassedOn = subqueries.map((each, i) => each + `\n}\n${intermediateWithMetaStatements[i] || ""}`);
                res.strs.push(subqueriesWithMetaPassedOn.join(`\nCALL {\n\t WITH ${withVars.join(", ")}\n\t`));
            }
            else {
                res.strs.push(subqueries.join("\n"));
            }
            return res;
        }
        if (!hasAppliedTimeStamps) {
            const timestampedFields = node.temporalFields.filter((temporalField) => ["DateTime", "Time"].includes(temporalField.typeMeta.name) &&
                temporalField.timestamps?.includes("UPDATE"));
            timestampedFields.forEach((field) => {
                // DateTime -> datetime(); Time -> time()
                res.strs.push(`SET ${varName}.${field.dbPropertyName} = ${field.typeMeta.name.toLowerCase()}()`);
            });
            hasAppliedTimeStamps = true;
        }
        node.primitiveFields.forEach((field) => (0, callback_utils_1.addCallbackAndSetParam)(field, varName, updateInput, callbackBucket, res.strs, "UPDATE"));
        const mathMatch = (0, math_1.matchMathField)(key);
        const { hasMatched, propertyName } = mathMatch;
        const settableFieldComparator = hasMatched ? propertyName : key;
        const settableField = node.mutableFields.find((x) => x.fieldName === settableFieldComparator);
        const authableField = node.authableFields.find((x) => x.fieldName === key || `${x.fieldName}_PUSH` === key || `${x.fieldName}_POP` === key);
        if (settableField) {
            if (settableField.typeMeta.required && value === null) {
                throw new Error(`Cannot set non-nullable field ${node.name}.${settableField.fieldName} to null`);
            }
            if (pointField) {
                if (pointField.typeMeta.array) {
                    res.strs.push(`SET ${varName}.${dbFieldName} = [p in $${param} | point(p)]`);
                }
                else {
                    res.strs.push(`SET ${varName}.${dbFieldName} = point($${param})`);
                }
            }
            else if (hasMatched) {
                const mathDescriptor = (0, math_1.mathDescriptorBuilder)(value, node, mathMatch);
                if (updateInput[mathDescriptor.dbName]) {
                    throw new Error(`Cannot mutate the same field multiple times in one Mutation: ${mathDescriptor.dbName}`);
                }
                const mathStatements = (0, math_1.buildMathStatements)(mathDescriptor, varName, withVars, param);
                res.strs.push(...mathStatements);
            }
            else {
                res.strs.push(`SET ${varName}.${dbFieldName} = $${param}`);
            }
            res.params[param] = value;
        }
        if (authableField) {
            if (authableField.auth) {
                const preAuth = (0, create_auth_and_params_1.createAuthAndParams)({
                    entity: authableField,
                    operations: "UPDATE",
                    context,
                    allow: { varName, parentNode: node },
                });
                const postAuth = (0, create_auth_and_params_1.createAuthAndParams)({
                    entity: authableField,
                    operations: "UPDATE",
                    skipRoles: true,
                    skipIsAuthenticated: true,
                    context,
                    bind: { parentNode: node, varName },
                });
                if (!res.meta) {
                    res.meta = { preArrayMethodValidationStrs: [], preAuthStrs: [], postAuthStrs: [] };
                }
                if (preAuth[0]) {
                    res.meta.preAuthStrs.push(preAuth[0]);
                    res.params = { ...res.params, ...preAuth[1] };
                }
                if (postAuth[0]) {
                    res.meta.postAuthStrs.push(postAuth[0]);
                    res.params = { ...res.params, ...postAuth[1] };
                }
            }
        }
        const pushSuffix = "_PUSH";
        const pushField = node.mutableFields.find((x) => `${x.fieldName}${pushSuffix}` === key);
        if (pushField) {
            if (pushField.dbPropertyName && updateInput[pushField.dbPropertyName]) {
                throw new Error(`Cannot mutate the same field multiple times in one Mutation: ${pushField.dbPropertyName}`);
            }
            validateNonNullProperty(res, varName, pushField);
            const pointArrayField = node.pointFields.find((x) => `${x.fieldName}_PUSH` === key);
            if (pointArrayField) {
                res.strs.push(`SET ${varName}.${pushField.dbPropertyName} = ${varName}.${pushField.dbPropertyName} + [p in $${param} | point(p)]`);
            }
            else {
                res.strs.push(`SET ${varName}.${pushField.dbPropertyName} = ${varName}.${pushField.dbPropertyName} + $${param}`);
            }
            res.params[param] = value;
        }
        const popSuffix = `_POP`;
        const popField = node.mutableFields.find((x) => `${x.fieldName}${popSuffix}` === key);
        if (popField) {
            if (popField.dbPropertyName && updateInput[popField.dbPropertyName]) {
                throw new Error(`Cannot mutate the same field multiple times in one Mutation: ${popField.dbPropertyName}`);
            }
            validateNonNullProperty(res, varName, popField);
            res.strs.push(`SET ${varName}.${popField.dbPropertyName} = ${varName}.${popField.dbPropertyName}[0..-$${param}]`);
            res.params[param] = value;
        }
        return res;
    }
    const reducedUpdate = Object.entries(updateInput).reduce(reducer, {
        strs: [],
        params: {},
    });
    const { strs, meta = { preArrayMethodValidationStrs: [], preAuthStrs: [], postAuthStrs: [] } } = reducedUpdate;
    let params = reducedUpdate.params;
    let preAuthStrs = [];
    let postAuthStrs = [];
    const withStr = `WITH ${withVars.join(", ")}`;
    const preAuth = (0, create_auth_and_params_1.createAuthAndParams)({
        entity: node,
        context,
        allow: { parentNode: node, varName },
        operations: "UPDATE",
    });
    if (preAuth[0]) {
        preAuthStrs.push(preAuth[0]);
        params = { ...params, ...preAuth[1] };
    }
    const postAuth = (0, create_auth_and_params_1.createAuthAndParams)({
        entity: node,
        context,
        skipIsAuthenticated: true,
        skipRoles: true,
        operations: "UPDATE",
        bind: { parentNode: node, varName },
    });
    if (postAuth[0]) {
        postAuthStrs.push(postAuth[0]);
        params = { ...params, ...postAuth[1] };
    }
    if (meta) {
        preAuthStrs = [...preAuthStrs, ...meta.preAuthStrs];
        postAuthStrs = [...postAuthStrs, ...meta.postAuthStrs];
    }
    let preArrayMethodValidationStr = "";
    let preAuthStr = "";
    let postAuthStr = "";
    const relationshipValidationStr = includeRelationshipValidation
        ? (0, create_relationship_validation_string_1.default)({ node, context, varName })
        : "";
    const forbiddenString = `"${constants_1.AUTH_FORBIDDEN_ERROR}"`;
    if (meta.preArrayMethodValidationStrs.length) {
        const nullChecks = meta.preArrayMethodValidationStrs.map((validationStr) => `${validationStr[0]} IS NULL`);
        const propertyNames = meta.preArrayMethodValidationStrs.map((validationStr) => validationStr[1]);
        preArrayMethodValidationStr = `CALL apoc.util.validate(${nullChecks.join(" OR ")}, "${(0, pluralize_1.default)("Property", propertyNames.length)} ${propertyNames.map(() => "%s").join(", ")} cannot be NULL", [${(0, wrap_string_in_apostrophes_1.wrapStringInApostrophes)(propertyNames).join(", ")}])`;
    }
    if (preAuthStrs.length) {
        const apocStr = `CALL apoc.util.validate(NOT (${preAuthStrs.join(" AND ")}), ${forbiddenString}, [0])`;
        preAuthStr = `${withStr}\n${apocStr}`;
    }
    if (postAuthStrs.length) {
        const apocStr = `CALL apoc.util.validate(NOT (${postAuthStrs.join(" AND ")}), ${forbiddenString}, [0])`;
        postAuthStr = `${withStr}\n${apocStr}`;
    }
    let statements = strs;
    if (context.subscriptionsEnabled) {
        statements = wrapInSubscriptionsMetaCall({
            withVars,
            nodeVariable: varName,
            typename: node.name,
            statements: strs,
        });
    }
    return [
        [
            preAuthStr,
            preArrayMethodValidationStr,
            ...statements,
            postAuthStr,
            ...(relationshipValidationStr ? [withStr, relationshipValidationStr] : []),
        ].join("\n"),
        params,
    ];
}
exports.default = createUpdateAndParams;
function validateNonNullProperty(res, varName, field) {
    if (!res.meta) {
        res.meta = { preArrayMethodValidationStrs: [], preAuthStrs: [], postAuthStrs: [] };
    }
    res.meta.preArrayMethodValidationStrs.push([`${varName}.${field.dbPropertyName}`, `${field.dbPropertyName}`]);
}
function wrapInSubscriptionsMetaCall({ statements, nodeVariable, typename, withVars, }) {
    const updateMetaVariable = "update_meta";
    const preCallWith = `WITH ${nodeVariable} { .* } AS ${constants_1.META_OLD_PROPS_CYPHER_VARIABLE}, ${withVars.join(", ")}`;
    const callBlock = ["WITH *", ...statements, `RETURN ${constants_1.META_CYPHER_VARIABLE} as ${updateMetaVariable}`];
    const postCallWith = `WITH *, ${updateMetaVariable} as ${constants_1.META_CYPHER_VARIABLE}`;
    const eventMeta = (0, create_event_meta_1.createEventMeta)({ event: "update", nodeVariable, typename });
    const eventMetaWith = `WITH ${(0, filter_meta_variable_1.filterMetaVariable)(withVars).join(", ")}, ${eventMeta}`;
    return [preCallWith, "CALL {", ...(0, indent_block_1.indentBlock)(callBlock), "}", postCallWith, eventMetaWith];
}
//# sourceMappingURL=create-update-and-params.js.map