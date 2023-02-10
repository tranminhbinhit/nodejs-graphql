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
exports.hasExplicitNodeInInterfaceWhere = exports.createConnectionWherePropertyOperation = exports.createConnectionOperation = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const utils_1 = require("../utils");
// Recursive function
const create_where_predicate_1 = require("../create-where-predicate");
const utils_2 = require("../../../utils/utils");
const logical_operators_1 = require("../../utils/logical-operators");
const create_relationship_operation_1 = require("./create-relationship-operation");
function createConnectionOperation({ connectionField, value, context, parentNode, operator, requiredVariables, }) {
    let nodeEntries;
    if (!connectionField?.relationship.union) {
        nodeEntries = { [connectionField.relationship.typeMeta.name]: value };
    }
    else {
        nodeEntries = value;
    }
    let subqueries;
    const operations = [];
    const aggregatingVariables = [];
    const matchPatterns = [];
    Object.entries(nodeEntries).forEach((entry) => {
        let nodeOnValue = undefined;
        const nodeOnObj = entry[1]?.node?._on;
        if (nodeOnObj) {
            nodeOnValue = Object.keys(nodeOnObj)[0];
        }
        let refNode = context.nodes.find((x) => x.name === nodeOnValue || x.name === entry[0]);
        if (!refNode) {
            refNode = context.nodes.find((x) => x.interfaces.some((i) => i.name.value === entry[0]));
        }
        const relationField = connectionField.relationship;
        let labelsOfNodesImplementingInterface;
        let labels = refNode.getLabels(context);
        const hasOnlyNodeObjectFilter = entry[1]?.node && !nodeOnObj;
        if (hasOnlyNodeObjectFilter) {
            const nodesImplementingInterface = context.nodes.filter((x) => x.interfaces.some((i) => i.name.value === entry[0]));
            labelsOfNodesImplementingInterface = nodesImplementingInterface.map((n) => n.getLabels(context)).flat();
            if (labelsOfNodesImplementingInterface?.length) {
                // set labels to an empty array. We check for the possible interface implementations in the WHERE clause instead (that is Neo4j 4.x safe)
                labels = [];
            }
        }
        const childNode = new cypher_builder_1.default.Node({ labels });
        let orOperatorMultipleNodeLabels;
        if (labelsOfNodesImplementingInterface?.length) {
            orOperatorMultipleNodeLabels = cypher_builder_1.default.or(...labelsOfNodesImplementingInterface.map((label) => childNode.hasLabel(label)));
        }
        const relationship = new cypher_builder_1.default.Relationship({
            source: relationField.direction === "IN" ? childNode : parentNode,
            target: relationField.direction === "IN" ? parentNode : childNode,
            type: relationField.type,
        });
        const matchPattern = relationship.pattern({
            source: relationField.direction === "IN" ? { variable: true } : { labels: false },
            target: relationField.direction === "IN" ? { labels: false } : { variable: true },
            relationship: { variable: true },
        });
        let listPredicateStr = (0, utils_1.getListPredicate)(operator);
        const contextRelationship = context.relationships.find((x) => x.name === connectionField.relationshipTypeName);
        const innerOperation = createConnectionWherePropertyOperation({
            context,
            whereInput: entry[1],
            edgeRef: relationship,
            targetNode: childNode,
            edge: contextRelationship,
            node: refNode,
            listPredicateStr,
        });
        if (orOperatorMultipleNodeLabels) {
            innerOperation.predicate = cypher_builder_1.default.and(innerOperation.predicate, orOperatorMultipleNodeLabels);
        }
        subqueries = cypher_builder_1.default.concat(subqueries, innerOperation.preComputedSubqueries);
        requiredVariables.push(...innerOperation.requiredVariables);
        aggregatingVariables.push(...innerOperation.aggregatingVariables);
        matchPatterns.push(matchPattern);
        if (listPredicateStr === "any" && !connectionField.relationship.typeMeta.array) {
            listPredicateStr = "single";
        }
        const predicate = (0, create_relationship_operation_1.createRelationshipPredicate)({
            matchPattern,
            listPredicateStr,
            childNode,
            innerOperation: innerOperation.predicate,
            edgePredicate: true,
        });
        operations.push(predicate);
    });
    if (aggregatingVariables && aggregatingVariables.length) {
        const aggregatingWithClause = new cypher_builder_1.default.With(parentNode, ...requiredVariables, ...aggregatingVariables.map((returnVar) => [cypher_builder_1.default.collect(returnVar), returnVar]));
        return {
            predicate: cypher_builder_1.default.and(...operations),
            preComputedSubqueries: cypher_builder_1.default.concat(...matchPatterns.map((matchPattern) => new cypher_builder_1.default.OptionalMatch(matchPattern)), subqueries, aggregatingWithClause),
            requiredVariables: [...requiredVariables, ...aggregatingVariables],
            aggregatingVariables: [],
        };
    }
    return {
        predicate: cypher_builder_1.default.and(...operations),
        preComputedSubqueries: subqueries,
        requiredVariables: requiredVariables,
        aggregatingVariables: [],
    };
}
exports.createConnectionOperation = createConnectionOperation;
function createConnectionWherePropertyOperation({ context, whereInput, edgeRef, targetNode, node, edge, listPredicateStr, }) {
    const requiredVariables = [];
    const aggregatingVariables = [];
    const preComputedSubqueriesResult = [];
    const params = [];
    Object.entries(whereInput).forEach(([key, value]) => {
        if ((0, logical_operators_1.isLogicalOperator)(key)) {
            const subOperations = [];
            (0, utils_2.asArray)(value).forEach((input) => {
                const { predicate, preComputedSubqueries, requiredVariables: innerRequiredVariables, aggregatingVariables: innerAggregatingVariables, } = createConnectionWherePropertyOperation({
                    context,
                    whereInput: input,
                    edgeRef,
                    targetNode,
                    node,
                    edge,
                    listPredicateStr,
                });
                subOperations.push(predicate);
                if (preComputedSubqueries && !preComputedSubqueries.empty)
                    preComputedSubqueriesResult.push(preComputedSubqueries);
                requiredVariables.push(...innerRequiredVariables);
                aggregatingVariables.push(...innerAggregatingVariables);
            });
            const cypherLogicalOperator = (0, logical_operators_1.getCypherLogicalOperator)(key);
            params.push(cypherLogicalOperator(...(0, utils_2.filterTruthy)(subOperations)));
            return;
        }
        if (key.startsWith("edge")) {
            const nestedProperties = value;
            const { predicate: result, preComputedSubqueries, requiredVariables: innerRequiredVariables, aggregatingVariables: innerAggregatingVariables, } = (0, create_where_predicate_1.createWherePredicate)({
                targetElement: edgeRef,
                whereInput: nestedProperties,
                context,
                element: edge,
                listPredicateStr,
            });
            params.push(result);
            if (preComputedSubqueries && !preComputedSubqueries.empty)
                preComputedSubqueriesResult.push(preComputedSubqueries);
            requiredVariables.push(...innerRequiredVariables);
            aggregatingVariables.push(...innerAggregatingVariables);
            return;
        }
        if (key.startsWith("node") || key.startsWith(node.name)) {
            // TODO: improve nodeOn properties generation
            const nodeOnProperties = value._on?.[node.name] || {};
            const nestedProperties = { ...value, ...nodeOnProperties };
            delete nestedProperties._on;
            if (Object.keys(value).length === 1 &&
                value._on &&
                !Object.prototype.hasOwnProperty.call(value._on, node.name)) {
                throw new Error("_on is used as the only argument and node is not present within");
            }
            const { predicate: result, preComputedSubqueries, requiredVariables: innerRequiredVariables, aggregatingVariables: innerAggregatingVariables, } = (0, create_where_predicate_1.createWherePredicate)({
                targetElement: targetNode,
                whereInput: nestedProperties,
                context,
                element: node,
                listPredicateStr,
            });
            // NOTE: _NOT is handled by the size()=0
            params.push(result);
            if (preComputedSubqueries && !preComputedSubqueries.empty)
                preComputedSubqueriesResult.push(preComputedSubqueries);
            requiredVariables.push(...innerRequiredVariables);
            aggregatingVariables.push(...innerAggregatingVariables);
            return;
        }
    });
    return {
        predicate: cypher_builder_1.default.and(...(0, utils_2.filterTruthy)(params)),
        preComputedSubqueries: preComputedSubqueriesResult.length
            ? cypher_builder_1.default.concat(...preComputedSubqueriesResult)
            : undefined,
        requiredVariables,
        aggregatingVariables,
    };
}
exports.createConnectionWherePropertyOperation = createConnectionWherePropertyOperation;
/** Checks if a where property has an explicit interface inside _on */
function hasExplicitNodeInInterfaceWhere({ whereInput, node, }) {
    for (const [key, value] of Object.entries(whereInput)) {
        if (key.startsWith("node") || key.startsWith(node.name)) {
            if (Object.keys(value).length === 1 &&
                value._on &&
                !Object.prototype.hasOwnProperty.call(value._on, node.name)) {
                return false;
            }
            return true;
        }
    }
    return true;
}
exports.hasExplicitNodeInInterfaceWhere = hasExplicitNodeInInterfaceWhere;
//# sourceMappingURL=create-connection-operation.js.map