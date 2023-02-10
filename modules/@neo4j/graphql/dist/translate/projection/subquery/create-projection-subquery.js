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
exports.createProjectionSubquery = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_where_predicate_1 = require("../../where/create-where-predicate");
const create_auth_and_params_1 = require("../../create-auth-and-params");
const constants_1 = require("../../../constants");
const add_sort_and_limit_to_clause_1 = require("./add-sort-and-limit-to-clause");
function createProjectionSubquery({ parentNode, whereInput, node, context, alias, nestedProjection, nestedSubqueries, relationField, relationshipDirection, optionsInput, authValidateStrs, addSkipAndLimit = true, collect = true, }) {
    const isArray = relationField.typeMeta.array;
    const targetNode = new cypher_builder_1.default.NamedNode(alias, {
        labels: node.getLabels(context),
    });
    const relationship = new cypher_builder_1.default.Relationship({
        source: parentNode,
        target: targetNode,
        type: relationField.type,
    });
    if (relationshipDirection === "IN") {
        relationship.reverse();
    }
    const isUndirected = relationshipDirection === "undirected";
    const pattern = relationship.pattern({ directed: !isUndirected });
    const subqueryMatch = new cypher_builder_1.default.Match(pattern);
    const predicates = [];
    const projection = new cypher_builder_1.default.RawCypher((env) => {
        // TODO: use MapProjection
        return `${targetNode.getCypher(env)} ${nestedProjection}`;
    });
    let preComputedWhereFieldSubqueries;
    if (whereInput) {
        const { predicate: wherePredicate, preComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
            element: node,
            context,
            whereInput,
            targetElement: targetNode,
        });
        if (wherePredicate)
            predicates.push(wherePredicate);
        preComputedWhereFieldSubqueries = preComputedSubqueries;
    }
    const whereAuth = (0, create_auth_and_params_1.createAuthPredicates)({
        entity: node,
        operations: "READ",
        context,
        where: {
            varName: alias,
            node,
        },
    });
    if (whereAuth) {
        predicates.push(whereAuth);
    }
    const preAuth = (0, create_auth_and_params_1.createAuthPredicates)({
        entity: node,
        operations: "READ",
        context,
        allow: {
            parentNode: node,
            varName: alias,
        },
    });
    if (preAuth) {
        const allowAuth = new cypher_builder_1.default.apoc.ValidatePredicate(cypher_builder_1.default.not(preAuth), constants_1.AUTH_FORBIDDEN_ERROR);
        predicates.push(allowAuth);
    }
    if (authValidateStrs?.length) {
        const authValidateStatements = authValidateStrs.map((str) => new cypher_builder_1.default.RawCypher(str));
        const authValidatePredicate = cypher_builder_1.default.and(...authValidateStatements);
        const authStatement = new cypher_builder_1.default.apoc.ValidatePredicate(cypher_builder_1.default.not(authValidatePredicate), constants_1.AUTH_FORBIDDEN_ERROR);
        predicates.push(authStatement);
    }
    const returnVariable = new cypher_builder_1.default.NamedVariable(alias);
    const withStatement = new cypher_builder_1.default.With([projection, returnVariable]); // This only works if nestedProjection is a map
    if (addSkipAndLimit) {
        (0, add_sort_and_limit_to_clause_1.addSortAndLimitOptionsToClause)({
            optionsInput,
            target: returnVariable,
            projectionClause: withStatement,
        });
    }
    let returnProjection = targetNode;
    if (collect) {
        returnProjection = cypher_builder_1.default.collect(targetNode);
        if (!isArray) {
            returnProjection = cypher_builder_1.default.head(returnProjection);
        }
    }
    const returnStatement = new cypher_builder_1.default.Return([returnProjection, returnVariable]);
    if (preComputedWhereFieldSubqueries && !preComputedWhereFieldSubqueries.empty) {
        const preComputedSubqueryWith = new cypher_builder_1.default.With("*");
        preComputedSubqueryWith.where(cypher_builder_1.default.and(...predicates));
        return cypher_builder_1.default.concat(subqueryMatch, preComputedWhereFieldSubqueries, preComputedSubqueryWith, ...nestedSubqueries, withStatement, returnStatement);
    }
    subqueryMatch.where(cypher_builder_1.default.and(...predicates));
    return cypher_builder_1.default.concat(subqueryMatch, ...nestedSubqueries, withStatement, returnStatement);
}
exports.createProjectionSubquery = createProjectionSubquery;
//# sourceMappingURL=create-projection-subquery.js.map