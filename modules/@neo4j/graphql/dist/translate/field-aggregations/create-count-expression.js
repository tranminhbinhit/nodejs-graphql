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
exports.createCountExpression = void 0;
const get_relationship_direction_1 = require("../../utils/get-relationship-direction");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_where_predicate_1 = require("../where/create-where-predicate");
function createCountExpression({ sourceNode, relationAggregationField, referenceNode, context, field, authCallWhere, targetNode, }) {
    const relationship = new cypher_builder_1.default.Relationship({
        source: sourceNode,
        target: targetNode,
        type: relationAggregationField.type,
    });
    const direction = (0, get_relationship_direction_1.getRelationshipDirection)(relationAggregationField, {
        directed: field.args.directed,
    });
    if (direction === "IN")
        relationship.reverse();
    const relationshipPattern = relationship.pattern({
        directed: !(direction === "undirected"),
    });
    const { predicate: wherePredicate, preComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
        element: referenceNode,
        context,
        whereInput: field.args.where || {},
        targetElement: targetNode,
    });
    const patternComprehension = new cypher_builder_1.default.PatternComprehension(relationshipPattern, targetNode);
    if (wherePredicate) {
        patternComprehension.where(wherePredicate);
    }
    if (authCallWhere) {
        patternComprehension.and(authCallWhere);
    }
    return { countProjection: cypher_builder_1.default.size(patternComprehension), preComputedSubqueries };
}
exports.createCountExpression = createCountExpression;
//# sourceMappingURL=create-count-expression.js.map