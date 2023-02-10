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
const utils_1 = require("../utils/utils");
const filter_interface_nodes_1 = require("../utils/filter-interface-nodes");
const create_auth_and_params_1 = require("./create-auth-and-params");
const create_projection_and_params_1 = __importDefault(require("./create-projection-and-params"));
const get_relationship_direction_1 = require("../utils/get-relationship-direction");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const add_sort_and_limit_to_clause_1 = require("./projection/subquery/add-sort-and-limit-to-clause");
const create_where_predicate_1 = require("./where/create-where-predicate");
const constants_1 = require("../constants");
function createInterfaceProjectionAndParams({ resolveTree, field, context, nodeVariable, withVars, }) {
    const fullWithVars = (0, utils_1.removeDuplicates)([...(0, utils_1.asArray)(withVars), nodeVariable]);
    const parentNode = new cypher_builder_1.default.NamedNode(nodeVariable);
    const whereInput = resolveTree.args.where;
    const returnVariable = `${nodeVariable}_${field.fieldName}`;
    const referenceNodes = context.nodes.filter((node) => field.interface?.implementations?.includes(node.name) && (0, filter_interface_nodes_1.filterInterfaceNodes)({ node, whereInput }));
    const subqueries = referenceNodes.map((refNode) => {
        return createInterfaceSubquery({
            refNode,
            nodeVariable,
            field,
            resolveTree,
            context,
            parentNode,
            fullWithVars,
        });
    });
    const optionsInput = resolveTree.args.options;
    let withClause;
    if (optionsInput) {
        withClause = new cypher_builder_1.default.With("*");
        const target = new cypher_builder_1.default.NamedNode(returnVariable);
        (0, add_sort_and_limit_to_clause_1.addSortAndLimitOptionsToClause)({
            optionsInput,
            projectionClause: withClause,
            target,
        });
    }
    const unionClause = new cypher_builder_1.default.Union(...subqueries);
    const call = new cypher_builder_1.default.Call(unionClause);
    return new cypher_builder_1.default.RawCypher((env) => {
        const subqueryStr = call.getCypher(env);
        const withStr = withClause ? `${withClause.getCypher(env)}\n` : "";
        let interfaceProjection = [`WITH *`, subqueryStr];
        if (field.typeMeta.array) {
            interfaceProjection = [
                `WITH *`,
                "CALL {",
                ...interfaceProjection,
                `${withStr}RETURN collect(${returnVariable}) AS ${returnVariable}`,
                "}",
            ];
        }
        return interfaceProjection.join("\n");
    });
}
exports.default = createInterfaceProjectionAndParams;
function createInterfaceSubquery({ refNode, nodeVariable, field, resolveTree, context, parentNode, fullWithVars, }) {
    const whereInput = resolveTree.args.where;
    const param = `${nodeVariable}_${refNode.name}`;
    const relatedNode = new cypher_builder_1.default.NamedNode(param, {
        labels: refNode.getLabels(context),
    });
    const relationshipRef = new cypher_builder_1.default.Relationship({
        source: parentNode,
        target: relatedNode,
        type: field.type,
    });
    const direction = (0, get_relationship_direction_1.getRelationshipDirection)(field, resolveTree.args);
    const pattern = relationshipRef.pattern({
        source: {
            labels: false,
        },
        directed: direction !== "undirected",
    });
    if (direction === "IN")
        pattern.reverse();
    const withClause = new cypher_builder_1.default.With(...fullWithVars.map((f) => new cypher_builder_1.default.NamedVariable(f)));
    const matchQuery = new cypher_builder_1.default.Match(pattern);
    const predicates = [];
    const authAllowPredicate = (0, create_auth_and_params_1.createAuthPredicates)({
        entity: refNode,
        operations: "READ",
        allow: {
            parentNode: refNode,
            varName: relatedNode,
        },
        context,
    });
    if (authAllowPredicate) {
        const apocValidateClause = new cypher_builder_1.default.apoc.ValidatePredicate(cypher_builder_1.default.not(authAllowPredicate), constants_1.AUTH_FORBIDDEN_ERROR);
        predicates.push(apocValidateClause);
    }
    let preComputedWhereFieldSubqueries;
    if (resolveTree.args.where) {
        const whereInput2 = {
            ...Object.entries(whereInput).reduce((args, [k, v]) => {
                if (k !== "_on") {
                    return { ...args, [k]: v };
                }
                return args;
            }, {}),
            ...(whereInput?._on?.[refNode.name] || {}),
        };
        const { predicate: wherePredicate, preComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
            whereInput: whereInput2,
            context,
            targetElement: relatedNode,
            element: refNode,
        });
        if (wherePredicate) {
            predicates.push(wherePredicate);
        }
        preComputedWhereFieldSubqueries = preComputedSubqueries;
    }
    const whereAuthPredicate = (0, create_auth_and_params_1.createAuthPredicates)({
        entity: refNode,
        operations: "READ",
        where: {
            node: refNode,
            varName: relatedNode,
        },
        context,
    });
    if (whereAuthPredicate) {
        predicates.push(whereAuthPredicate);
    }
    const { projection: projectionStr, subqueries: projectionSubQueries, subqueriesBeforeSort, } = (0, create_projection_and_params_1.default)({
        resolveTree,
        node: refNode,
        context,
        varName: param,
        literalElements: true,
        resolveType: true,
    });
    const projectionSubqueryClause = cypher_builder_1.default.concat(...subqueriesBeforeSort, ...projectionSubQueries);
    const returnClause = new cypher_builder_1.default.Return([new cypher_builder_1.default.RawCypher(projectionStr), `${nodeVariable}_${field.fieldName}`]);
    if (preComputedWhereFieldSubqueries && preComputedWhereFieldSubqueries?.empty) {
        const preComputedWhereFieldsWith = new cypher_builder_1.default.With("*");
        preComputedWhereFieldsWith.where(cypher_builder_1.default.and(...predicates));
        return cypher_builder_1.default.concat(withClause, matchQuery, preComputedWhereFieldSubqueries, preComputedWhereFieldsWith, projectionSubqueryClause, returnClause);
    }
    matchQuery.where(cypher_builder_1.default.and(...predicates));
    return cypher_builder_1.default.concat(withClause, matchQuery, projectionSubqueryClause, returnClause);
}
//# sourceMappingURL=create-interface-projection-and-params.js.map