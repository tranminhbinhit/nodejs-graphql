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
exports.createRelationshipPredicate = exports.createRelationshipOperation = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_where_predicate_1 = require("../create-where-predicate");
const utils_1 = require("../utils");
function createRelationshipOperation({ relationField, context, parentNode, operator, value, isNot, requiredVariables, }) {
    const refNode = context.nodes.find((n) => n.name === relationField.typeMeta.name);
    if (!refNode)
        throw new Error("Relationship filters must reference nodes");
    const childNode = new cypher_builder_1.default.Node({ labels: refNode.getLabels(context) });
    const relationship = new cypher_builder_1.default.Relationship({
        source: relationField.direction === "IN" ? childNode : parentNode,
        target: relationField.direction === "IN" ? parentNode : childNode,
        type: relationField.type,
    });
    const matchPattern = relationship.pattern({
        source: relationField.direction === "IN" ? { variable: true } : { labels: false },
        target: relationField.direction === "IN" ? { labels: false } : { variable: true },
        relationship: { variable: false },
    });
    // TODO: check null in return projection
    if (value === null) {
        const existsSubquery = new cypher_builder_1.default.Match(matchPattern, {});
        const exists = new cypher_builder_1.default.Exists(existsSubquery);
        if (!isNot) {
            // Bit confusing, but basically checking for not null is the same as checking for relationship exists
            return { predicate: cypher_builder_1.default.not(exists), requiredVariables: [], aggregatingVariables: [] };
        }
        return { predicate: exists, requiredVariables: [], aggregatingVariables: [] };
    }
    let listPredicateStr = (0, utils_1.getListPredicate)(operator);
    if (listPredicateStr === "any" && !relationField.typeMeta.array) {
        listPredicateStr = "single";
    }
    const { predicate: innerOperation, preComputedSubqueries, requiredVariables: innerRequiredVariables, aggregatingVariables, } = (0, create_where_predicate_1.createWherePredicate)({
        // Nested properties here
        whereInput: value,
        targetElement: childNode,
        element: refNode,
        context,
        listPredicateStr,
    });
    requiredVariables = [...requiredVariables, ...innerRequiredVariables];
    const predicate = createRelationshipPredicate({
        childNode,
        matchPattern,
        listPredicateStr,
        innerOperation,
    });
    if (aggregatingVariables && aggregatingVariables.length) {
        const aggregatingWithClause = new cypher_builder_1.default.With(parentNode, ...requiredVariables, ...aggregatingVariables.map((returnVar) => [cypher_builder_1.default.collect(returnVar), returnVar]));
        return {
            predicate,
            preComputedSubqueries: cypher_builder_1.default.concat(new cypher_builder_1.default.OptionalMatch(matchPattern), preComputedSubqueries, aggregatingWithClause),
            requiredVariables: [...requiredVariables, ...aggregatingVariables],
            aggregatingVariables: [],
        };
    }
    return {
        predicate,
        preComputedSubqueries: preComputedSubqueries,
        requiredVariables,
        aggregatingVariables: [],
    };
}
exports.createRelationshipOperation = createRelationshipOperation;
function createRelationshipPredicate({ matchPattern, listPredicateStr, childNode, innerOperation, edgePredicate, }) {
    if (!innerOperation)
        return undefined;
    const matchClause = new cypher_builder_1.default.Match(matchPattern).where(innerOperation);
    switch (listPredicateStr) {
        case "all": {
            // Testing "ALL" requires testing that at least one element exists and that no elements not matching the filter exists
            const notExistsMatchClause = new cypher_builder_1.default.Match(matchPattern).where(cypher_builder_1.default.not(innerOperation));
            return cypher_builder_1.default.and(new cypher_builder_1.default.Exists(matchClause), cypher_builder_1.default.not(new cypher_builder_1.default.Exists(notExistsMatchClause)));
        }
        case "single": {
            // If there are edge properties used in the innerOperation predicate, it is not possible to use the
            // more performant single() function. Therefore, we fall back to size()
            if (edgePredicate) {
                const sizeFunction = cypher_builder_1.default.size(new cypher_builder_1.default.PatternComprehension(matchPattern, new cypher_builder_1.default.Literal(1)).where(innerOperation));
                return cypher_builder_1.default.eq(sizeFunction, new cypher_builder_1.default.Literal(1));
            }
            const patternComprehension = new cypher_builder_1.default.PatternComprehension(matchPattern, childNode);
            return cypher_builder_1.default.single(childNode, patternComprehension, innerOperation);
        }
        case "not":
        case "none":
        case "some":
        default: {
            const existsPredicate = new cypher_builder_1.default.Exists(matchClause);
            if (["not", "none"].includes(listPredicateStr)) {
                return cypher_builder_1.default.not(existsPredicate);
            }
            return existsPredicate;
        }
    }
}
exports.createRelationshipPredicate = createRelationshipPredicate;
//# sourceMappingURL=create-relationship-operation.js.map