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
const utils_1 = require("@graphql-tools/utils");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_auth_and_params_1 = require("./create-auth-and-params");
const create_datetime_element_1 = require("./projection/elements/create-datetime-element");
const create_point_element_1 = __importDefault(require("./projection/elements/create-point-element"));
const map_to_db_property_1 = __importDefault(require("../utils/map-to-db-property"));
const create_field_aggregation_1 = require("./field-aggregations/create-field-aggregation");
const global_node_projection_1 = require("../utils/global-node-projection");
const get_relationship_direction_1 = require("../utils/get-relationship-direction");
const resolveTree_1 = require("./utils/resolveTree");
const utils_2 = require("../utils/utils");
const create_projection_subquery_1 = require("./projection/subquery/create-projection-subquery");
const collect_union_subqueries_results_1 = require("./projection/subquery/collect-union-subqueries-results");
const create_interface_projection_and_params_1 = __importDefault(require("./create-interface-projection-and-params"));
const create_connection_clause_1 = require("./connection-clause/create-connection-clause");
const translate_cypher_directive_projection_1 = require("./projection/subquery/translate-cypher-directive-projection");
function createProjectionAndParams({ resolveTree, node, context, chainStr, varName, literalElements, resolveType, }) {
    function reducer(res, field) {
        const alias = field.alias;
        let param = "";
        if (chainStr) {
            param = `${chainStr}_${alias}`;
        }
        else {
            param = `${varName}_${alias}`;
        }
        const whereInput = field.args.where;
        const optionsInput = (field.args.options || {});
        const cypherField = node.cypherFields.find((x) => x.fieldName === field.name);
        const relationField = node.relationFields.find((x) => x.fieldName === field.name);
        const connectionField = node.connectionFields.find((x) => x.fieldName === field.name);
        const pointField = node.pointFields.find((x) => x.fieldName === field.name);
        const temporalField = node.temporalFields.find((x) => x.fieldName === field.name);
        const authableField = node.authableFields.find((x) => x.fieldName === field.name);
        if (authableField) {
            // TODO: move this to translate-top-level
            if (authableField.auth) {
                const allowAndParams = (0, create_auth_and_params_1.createAuthAndParams)({
                    entity: authableField,
                    operations: "READ",
                    context,
                    allow: { parentNode: node, varName },
                });
                if (allowAndParams[0]) {
                    if (!res.meta.authValidateStrs) {
                        res.meta.authValidateStrs = [];
                    }
                    res.meta.authValidateStrs?.push(allowAndParams[0]);
                    res.params = { ...res.params, ...allowAndParams[1] };
                }
            }
        }
        if (cypherField) {
            return (0, translate_cypher_directive_projection_1.translateCypherDirectiveProjection)({
                context,
                cypherField,
                field,
                node,
                alias,
                param,
                chainStr: chainStr || varName,
                res,
            });
        }
        if (relationField) {
            const referenceNode = context.nodes.find((x) => x.name === relationField.typeMeta.name);
            if (referenceNode?.queryOptions) {
                optionsInput.limit = referenceNode.queryOptions.getLimit(optionsInput.limit);
            }
            if (relationField.interface) {
                const interfaceResolveTree = field;
                const prevRelationshipFields = [];
                const relationshipField = node.relationFields.find((x) => x.fieldName === interfaceResolveTree.name);
                const interfaceProjection = (0, create_interface_projection_and_params_1.default)({
                    resolveTree: interfaceResolveTree,
                    field: relationshipField,
                    context,
                    nodeVariable: varName,
                    withVars: prevRelationshipFields,
                });
                res.subqueries.push(interfaceProjection);
                res.projection.push(`${field.alias}: ${varName}_${field.name}`);
                return res;
            }
            if (relationField.union) {
                const referenceNodes = context.nodes.filter((x) => relationField.union?.nodes?.includes(x.name) &&
                    (!field.args.where || Object.prototype.hasOwnProperty.call(field.args.where, x.name)));
                const parentNode = new cypher_builder_1.default.NamedNode(chainStr || varName);
                const unionSubqueries = [];
                const unionVariableName = `${param}`;
                for (const refNode of referenceNodes) {
                    const refNodeInterfaceNames = node.interfaces.map((implementedInterface) => implementedInterface.name.value);
                    const hasFields = Object.keys(field.fieldsByTypeName).some((fieldByTypeName) => [refNode.name, ...refNodeInterfaceNames].includes(fieldByTypeName));
                    const recurse = createProjectionAndParams({
                        resolveTree: field,
                        node: refNode,
                        context,
                        varName: `${varName}_${alias}`,
                        chainStr: unionVariableName,
                    });
                    res.params = { ...res.params, ...recurse.params };
                    const direction = (0, get_relationship_direction_1.getRelationshipDirection)(relationField, field.args);
                    let nestedProjection = [
                        ` { __resolveType: "${refNode.name}", `,
                        recurse.projection.replace("{", ""),
                    ].join("");
                    if (!hasFields) {
                        nestedProjection = `{ __resolveType: "${refNode.name}" }`;
                    }
                    const subquery = (0, create_projection_subquery_1.createProjectionSubquery)({
                        parentNode,
                        whereInput: field.args.where ? field.args.where[refNode.name] : field.args.where,
                        node: refNode,
                        context,
                        alias: unionVariableName,
                        nestedProjection,
                        nestedSubqueries: [...recurse.subqueriesBeforeSort, ...recurse.subqueries],
                        relationField,
                        relationshipDirection: direction,
                        optionsInput,
                        authValidateStrs: recurse.meta?.authValidateStrs,
                        addSkipAndLimit: false,
                        collect: false,
                    });
                    const unionWith = new cypher_builder_1.default.With("*");
                    unionSubqueries.push(cypher_builder_1.default.concat(unionWith, subquery));
                }
                const unionClause = new cypher_builder_1.default.Union(...unionSubqueries);
                const collectAndLimitStatements = (0, collect_union_subqueries_results_1.collectUnionSubqueriesResults)({
                    resultVariable: new cypher_builder_1.default.NamedNode(unionVariableName),
                    optionsInput,
                    isArray: Boolean(relationField.typeMeta.array),
                });
                const unionAndSort = cypher_builder_1.default.concat(new cypher_builder_1.default.Call(unionClause), collectAndLimitStatements);
                res.subqueries.push(new cypher_builder_1.default.Call(unionAndSort).innerWith(parentNode));
                res.projection.push(`${alias}: ${unionVariableName}`);
                return res;
            }
            const recurse = createProjectionAndParams({
                resolveTree: field,
                node: referenceNode || node,
                context,
                varName: `${varName}_${alias}`,
                chainStr: param,
            });
            res.params = { ...res.params, ...recurse.params };
            const parentNode = new cypher_builder_1.default.NamedNode(chainStr || varName);
            const direction = (0, get_relationship_direction_1.getRelationshipDirection)(relationField, field.args);
            const subquery = (0, create_projection_subquery_1.createProjectionSubquery)({
                parentNode,
                whereInput,
                node: referenceNode,
                context,
                alias: param,
                nestedProjection: recurse.projection,
                nestedSubqueries: [...recurse.subqueriesBeforeSort, ...recurse.subqueries],
                relationField,
                relationshipDirection: direction,
                optionsInput,
                authValidateStrs: recurse.meta?.authValidateStrs,
            });
            res.subqueries.push(new cypher_builder_1.default.Call(subquery).innerWith(parentNode));
            res.projection.push(`${alias}: ${param}`);
            return res;
        }
        const aggregationFieldProjection = (0, create_field_aggregation_1.createFieldAggregation)({
            context,
            nodeLabel: chainStr || varName,
            node,
            field,
        });
        if (aggregationFieldProjection) {
            if (aggregationFieldProjection.projectionSubqueryCypher) {
                res.subqueries.push(new cypher_builder_1.default.RawCypher(aggregationFieldProjection.projectionSubqueryCypher));
            }
            res.projection.push(`${alias}: ${aggregationFieldProjection.projectionCypher}`);
            res.params = { ...res.params, ...aggregationFieldProjection.projectionParams };
            return res;
        }
        if (connectionField) {
            const connectionClause = new cypher_builder_1.default.Call((0, create_connection_clause_1.createConnectionClause)({
                resolveTree: field,
                field: connectionField,
                context,
                nodeVariable: varName,
                returnVariable: new cypher_builder_1.default.NamedVariable(param),
            })).innerWith(new cypher_builder_1.default.NamedNode(varName));
            const connection = connectionClause.build(`${varName}_connection_${field.alias}`); // TODO: remove build from here
            const stupidParams = connection.params;
            const connectionSubClause = new cypher_builder_1.default.RawCypher(() => {
                // TODO: avoid REPLACE_ME in params and return them here
                return [connection.cypher, {}];
            });
            res.subqueries.push(connectionSubClause);
            res.projection.push(`${field.alias}: ${param}`);
            res.params = { ...res.params, ...stupidParams };
            return res;
        }
        if (pointField) {
            res.projection.push((0, create_point_element_1.default)({ resolveTree: field, field: pointField, variable: varName }));
        }
        else if (temporalField?.typeMeta.name === "DateTime") {
            res.projection.push((0, create_datetime_element_1.createDatetimeElement)({ resolveTree: field, field: temporalField, variable: varName }));
        }
        else {
            // In the case of using the @alias directive (map a GraphQL field to a db prop)
            // the output will be RETURN varName {GraphQLfield: varName.dbAlias}
            const dbFieldName = (0, map_to_db_property_1.default)(node, field.name);
            // If field is aliased, rename projected field to alias and set to varName.fieldName
            // e.g. RETURN varname { .fieldName } -> RETURN varName { alias: varName.fieldName }
            let aliasedProj;
            if (alias !== field.name || dbFieldName !== field.name || literalElements) {
                aliasedProj = `${alias}: ${varName}`;
            }
            else {
                aliasedProj = "";
            }
            res.projection.push(`${aliasedProj}.${dbFieldName}`);
        }
        return res;
    }
    let existingProjection = { ...resolveTree.fieldsByTypeName[node.name] };
    if (context.fulltextIndex) {
        return createFulltextProjection({
            resolveTree,
            node,
            context,
            chainStr,
            varName,
            literalElements,
            resolveType,
        });
    }
    // If we have a query for a globalNode and it includes the "id" field
    // we modify the projection to include the appropriate db fields
    if (node.isGlobalNode && existingProjection.id) {
        existingProjection = (0, global_node_projection_1.addGlobalIdField)(existingProjection, node.getGlobalIdField());
    }
    // Fields of reference node to sort on. Since sorting is done on projection, if field is not selected
    // sort will fail silently
    const sortFieldNames = (resolveTree.args.options?.sort ?? []).map(Object.keys).flat();
    // Iterate over fields name in sort argument
    const nodeFields = sortFieldNames.reduce((acc, sortFieldName) => ({
        ...acc,
        // If fieldname is not found in fields of selection set
        ...(!Object.values(existingProjection).find((field) => field.name === sortFieldName)
            ? // generate a basic resolve tree
                (0, resolveTree_1.generateProjectionField)({ name: sortFieldName })
            : {}),
    }), 
    // and add it to existing fields for projection
    existingProjection);
    // Include fields of implemented interfaces to allow for fragments on interfaces
    // cf. https://github.com/neo4j/graphql/issues/476
    const mergedSelectedFields = (0, utils_1.mergeDeep)([
        nodeFields,
        ...node.interfaces.map((i) => resolveTree.fieldsByTypeName[i.name.value]),
    ]);
    // Merge fields for final projection to account for multiple fragments
    // cf. https://github.com/neo4j/graphql/issues/920
    const mergedFields = (0, utils_1.mergeDeep)([
        mergedSelectedFields,
        generateMissingOrAliasedSortFields({ selection: mergedSelectedFields, resolveTree }),
        generateMissingOrAliasedRequiredFields({ selection: mergedSelectedFields, node }),
    ]);
    const { projection, params, meta, subqueries, subqueriesBeforeSort } = Object.values(mergedFields).reduce(reducer, {
        projection: resolveType ? [`__resolveType: "${node.name}"`] : [],
        params: {},
        meta: {},
        subqueries: [],
        subqueriesBeforeSort: [],
    });
    return {
        projection: `{ ${projection.join(", ")} }`,
        params,
        meta,
        subqueries,
        subqueriesBeforeSort,
    };
}
exports.default = createProjectionAndParams;
function getSortArgs(resolveTree) {
    const connectionArgs = resolveTree.args.sort;
    const optionsArgs = resolveTree.args.options?.sort;
    return connectionArgs || optionsArgs || [];
}
// Generates any missing fields required for sorting
const generateMissingOrAliasedSortFields = ({ selection, resolveTree, }) => {
    const sortArgs = getSortArgs(resolveTree);
    const sortFieldNames = (0, utils_2.removeDuplicates)(sortArgs.map(Object.keys).flat());
    return (0, resolveTree_1.generateMissingOrAliasedFields)({ fieldNames: sortFieldNames, selection });
};
// Generated any missing fields required for custom resolvers
const generateMissingOrAliasedRequiredFields = ({ node, selection, }) => {
    const requiredFields = (0, utils_2.removeDuplicates)((0, resolveTree_1.filterFieldsInSelection)({ fields: node.customResolverFields, selection })
        .map((f) => f.requiredFields)
        .flat());
    return (0, resolveTree_1.generateMissingOrAliasedFields)({ fieldNames: requiredFields, selection });
};
function createFulltextProjection({ resolveTree, node, context, chainStr, varName, literalElements, resolveType, }) {
    if (!resolveTree.fieldsByTypeName[node.fulltextTypeNames.result][node.singular]) {
        return {
            projection: "{ }",
            params: {},
            meta: {},
            subqueries: [],
            subqueriesBeforeSort: [],
        };
    }
    const nodeResolveTree = resolveTree.fieldsByTypeName[node.fulltextTypeNames.result][node.singular];
    const nodeContext = { ...context, fulltextIndex: false };
    return createProjectionAndParams({
        resolveTree: nodeResolveTree,
        node,
        context: nodeContext,
        chainStr,
        varName,
        literalElements,
        resolveType,
    });
}
//# sourceMappingURL=create-projection-and-params.js.map