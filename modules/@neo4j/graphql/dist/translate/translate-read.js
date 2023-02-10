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
exports.translateRead = void 0;
const graphql_relay_1 = require("graphql-relay");
const create_projection_and_params_1 = __importDefault(require("./create-projection-and-params"));
const create_auth_and_params_1 = require("./create-auth-and-params");
const constants_1 = require("../constants");
const translate_top_level_match_1 = require("./translate-top-level-match");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const add_sort_and_limit_to_clause_1 = require("./projection/subquery/add-sort-and-limit-to-clause");
const fulltext_1 = require("../graphql/directives/fulltext");
function translateRead({ node, context, isRootConnectionField, }, varName = "this") {
    const { resolveTree } = context;
    const matchNode = new cypher_builder_1.default.NamedNode(varName, { labels: node.getLabels(context) });
    let projAuth;
    const { matchClause: topLevelMatch, preComputedWhereFieldSubqueries, whereClause: topLevelWhereClause, } = (0, translate_top_level_match_1.createMatchClause)({
        matchNode,
        node,
        context,
        operation: "READ",
    });
    const projection = (0, create_projection_and_params_1.default)({
        node,
        context,
        resolveTree,
        varName,
    });
    if (projection.meta?.authValidateStrs?.length) {
        projAuth = new cypher_builder_1.default.RawCypher(`CALL apoc.util.validate(NOT (${projection.meta.authValidateStrs.join(" AND ")}), "${constants_1.AUTH_FORBIDDEN_ERROR}", [0])`);
    }
    const authPredicates = (0, create_auth_and_params_1.createAuthPredicates)({
        operations: "READ",
        entity: node,
        context,
        allow: {
            parentNode: node,
            varName,
        },
    });
    if (authPredicates) {
        topLevelWhereClause.where(new cypher_builder_1.default.apoc.ValidatePredicate(cypher_builder_1.default.not(authPredicates), constants_1.AUTH_FORBIDDEN_ERROR));
    }
    const projectionSubqueries = cypher_builder_1.default.concat(...projection.subqueries);
    const projectionSubqueriesBeforeSort = cypher_builder_1.default.concat(...projection.subqueriesBeforeSort);
    let orderClause;
    const optionsInput = (resolveTree.args.options || {});
    if (context.fulltextIndex) {
        optionsInput.sort = optionsInput.sort?.[node?.singular] || optionsInput.sort;
    }
    if (node.queryOptions) {
        optionsInput.limit = node.queryOptions.getLimit(optionsInput.limit); // TODO: improve this
        resolveTree.args.options = resolveTree.args.options || {};
        resolveTree.args.options.limit = optionsInput.limit;
    }
    const hasOrdering = optionsInput.sort || optionsInput.limit || optionsInput.offset;
    if (hasOrdering) {
        orderClause = new cypher_builder_1.default.With("*");
        (0, add_sort_and_limit_to_clause_1.addSortAndLimitOptionsToClause)({
            optionsInput,
            target: matchNode,
            projectionClause: orderClause,
            nodeField: node.singular,
            fulltextScoreVariable: context.fulltextIndex?.scoreVariable,
            cypherFields: node.cypherFields,
            varName,
        });
    }
    const projectionExpression = new cypher_builder_1.default.RawCypher(() => {
        return [`${varName} ${projection.projection}`, projection.params];
    });
    let returnClause = new cypher_builder_1.default.Return([projectionExpression, varName]);
    if (context.fulltextIndex?.scoreVariable) {
        returnClause = new cypher_builder_1.default.Return([projectionExpression, varName], [context.fulltextIndex?.scoreVariable, fulltext_1.SCORE_FIELD]);
    }
    let projectionClause = returnClause; // TODO avoid reassign
    let connectionPreClauses;
    if (isRootConnectionField) {
        const hasConnectionOrdering = resolveTree.args.first || resolveTree.args.after || resolveTree.args.sort;
        if (hasConnectionOrdering) {
            const afterInput = resolveTree.args.after;
            const offset = afterInput ? (0, graphql_relay_1.cursorToOffset)(afterInput) + 1 : undefined;
            orderClause = new cypher_builder_1.default.With("*");
            (0, add_sort_and_limit_to_clause_1.addSortAndLimitOptionsToClause)({
                optionsInput: {
                    sort: resolveTree.args.sort,
                    limit: resolveTree.args.first,
                    offset,
                },
                target: matchNode,
                projectionClause: orderClause,
                nodeField: node.singular,
                fulltextScoreVariable: context.fulltextIndex?.scoreVariable,
                cypherFields: node.cypherFields,
                varName,
            });
        }
        // TODO: unify with createConnectionClause
        const edgesVar = new cypher_builder_1.default.NamedVariable("edges");
        const edgeVar = new cypher_builder_1.default.NamedVariable("edge");
        const totalCountVar = new cypher_builder_1.default.NamedVariable("totalCount");
        const withCollect = new cypher_builder_1.default.With([cypher_builder_1.default.collect(matchNode), edgesVar]).with(edgesVar, [
            cypher_builder_1.default.size(edgesVar),
            totalCountVar,
        ]);
        const unwind = new cypher_builder_1.default.Unwind([edgesVar, matchNode]).with(matchNode, totalCountVar);
        connectionPreClauses = cypher_builder_1.default.concat(withCollect, unwind);
        const connectionEdge = new cypher_builder_1.default.Map({
            node: projectionExpression,
        });
        const withTotalCount = new cypher_builder_1.default.With([connectionEdge, edgeVar], totalCountVar, matchNode);
        const returnClause = new cypher_builder_1.default.With([cypher_builder_1.default.collect(edgeVar), edgesVar], totalCountVar).return([
            new cypher_builder_1.default.Map({
                edges: edgesVar,
                totalCount: totalCountVar,
            }),
            matchNode,
        ]);
        projectionClause = cypher_builder_1.default.concat(withTotalCount, returnClause);
    }
    const preComputedWhereFields = preComputedWhereFieldSubqueries && !preComputedWhereFieldSubqueries.empty
        ? cypher_builder_1.default.concat(preComputedWhereFieldSubqueries, topLevelWhereClause)
        : undefined;
    const readQuery = cypher_builder_1.default.concat(topLevelMatch, preComputedWhereFields, projAuth, connectionPreClauses, projectionSubqueriesBeforeSort, orderClause, // Required for performance optimization
    projectionSubqueries, projectionClause);
    return readQuery.build(undefined, context.cypherParams ? { cypherParams: context.cypherParams } : {});
}
exports.translateRead = translateRead;
//# sourceMappingURL=translate-read.js.map