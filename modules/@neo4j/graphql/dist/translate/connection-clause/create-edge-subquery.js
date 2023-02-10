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
exports.createEdgeSubquery = void 0;
const create_auth_and_params_1 = require("../create-auth-and-params");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_connection_operation_1 = require("../where/property-operations/create-connection-operation");
const get_or_create_cypher_variable_1 = require("../utils/get-or-create-cypher-variable");
const get_pattern_1 = require("../utils/get-pattern");
const connection_projection_1 = require("./connection-projection");
const get_sort_fields_1 = require("./get-sort-fields");
const constants_1 = require("../../constants");
const create_sort_and_limit_1 = require("./create-sort-and-limit");
/** Create the match, filtering and projection of the edge and the nested node */
function createEdgeSubquery({ resolveTree, field, context, parentNode, relatedNode, returnVariable, whereInput, resolveType = false, ignoreSort = false, }) {
    const parentNodeRef = (0, get_or_create_cypher_variable_1.getOrCreateCypherNode)(parentNode);
    const relatedNodeRef = new cypher_builder_1.default.NamedNode(`${parentNode}_${relatedNode.name}`, {
        labels: relatedNode.getLabels(context),
    });
    const relationshipRef = new cypher_builder_1.default.Relationship({
        source: parentNodeRef,
        target: relatedNodeRef,
        type: field.relationship.type,
    });
    const relPattern = (0, get_pattern_1.getPattern)({
        relationship: relationshipRef,
        field: field.relationship,
        resolveTree,
    });
    const matchClause = new cypher_builder_1.default.Match(relPattern);
    const predicates = [];
    let preComputedSubqueries;
    if (whereInput) {
        const relationship = context.relationships.find((r) => r.name === field.relationshipTypeName);
        const { predicate: wherePredicate, preComputedSubqueries: tempPreComputedSubqueries } = (0, create_connection_operation_1.createConnectionWherePropertyOperation)({
            context,
            whereInput,
            edgeRef: relationshipRef,
            targetNode: relatedNodeRef,
            node: relatedNode,
            edge: relationship,
        });
        if (wherePredicate)
            predicates.push(wherePredicate);
        preComputedSubqueries = tempPreComputedSubqueries;
    }
    const authPredicate = (0, create_auth_and_params_1.createAuthPredicates)({
        operations: "READ",
        entity: relatedNode,
        context,
        where: { varName: relatedNodeRef, node: relatedNode },
    });
    if (authPredicate)
        predicates.push(authPredicate);
    const authAllowPredicate = (0, create_auth_and_params_1.createAuthPredicates)({
        operations: "READ",
        entity: relatedNode,
        context,
        allow: {
            parentNode: relatedNode,
            varName: relatedNodeRef,
        },
    });
    if (authAllowPredicate)
        predicates.push(new cypher_builder_1.default.apoc.ValidatePredicate(cypher_builder_1.default.not(authAllowPredicate), constants_1.AUTH_FORBIDDEN_ERROR));
    const projection = (0, connection_projection_1.createEdgeProjection)({
        resolveTree,
        field,
        relationshipRef,
        relatedNode,
        relatedNodeVariableName: relatedNodeRef.name,
        context,
        resolveType,
        extraFields: (0, get_sort_fields_1.getEdgeSortFieldKeys)(resolveTree),
    });
    const withReturn = new cypher_builder_1.default.With([projection.projection, returnVariable]);
    let withSortClause;
    if (!ignoreSort) {
        withSortClause = (0, create_sort_and_limit_1.createSortAndLimitProjection)({
            resolveTree,
            relationshipRef,
            nodeRef: relatedNodeRef,
            limit: undefined,
            ignoreSkipLimit: true,
            extraFields: [relatedNodeRef],
        });
    }
    if (preComputedSubqueries && !preComputedSubqueries.empty) {
        const subqueryWith = new cypher_builder_1.default.With("*");
        subqueryWith.where(cypher_builder_1.default.and(...predicates));
        return cypher_builder_1.default.concat(matchClause, preComputedSubqueries, subqueryWith, withSortClause, ...projection.subqueries, withReturn);
    }
    matchClause.where(cypher_builder_1.default.and(...predicates));
    return cypher_builder_1.default.concat(matchClause, withSortClause, ...projection.subqueries, withReturn);
}
exports.createEdgeSubquery = createEdgeSubquery;
//# sourceMappingURL=create-edge-subquery.js.map