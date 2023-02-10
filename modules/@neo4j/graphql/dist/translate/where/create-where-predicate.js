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
exports.createWherePredicate = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
// Recursive function
const create_property_where_1 = require("./property-operations/create-property-where");
const logical_operators_1 = require("../utils/logical-operators");
const utils_1 = require("../../utils/utils");
/** Translate a target node and GraphQL input into a Cypher operation o valid where expression */
function createWherePredicate({ targetElement, whereInput, context, element, listPredicateStr, }) {
    const whereFields = Object.entries(whereInput);
    const predicates = [];
    const requiredVariables = [];
    const aggregatingVariables = [];
    let subqueries;
    whereFields.forEach(([key, value]) => {
        if ((0, logical_operators_1.isLogicalOperator)(key)) {
            const { predicate, preComputedSubqueries, requiredVariables: innerRequiredVariables, aggregatingVariables: innerAggregatingVariables, } = createNestedPredicate({
                key: key,
                element,
                targetElement,
                context,
                value: (0, utils_1.asArray)(value),
                listPredicateStr,
                requiredVariables,
            });
            if (predicate) {
                predicates.push(predicate);
                requiredVariables.push(...innerRequiredVariables);
                aggregatingVariables.push(...innerAggregatingVariables);
                if (preComputedSubqueries && !preComputedSubqueries.empty)
                    subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
            }
            return;
        }
        const { predicate, preComputedSubqueries, requiredVariables: innerRequiredVariables, aggregatingVariables: innerAggregatingVariables, } = (0, create_property_where_1.createPropertyWhere)({ key, value, element, targetElement, context, listPredicateStr, requiredVariables });
        if (predicate) {
            predicates.push(predicate);
            requiredVariables.push(...innerRequiredVariables);
            aggregatingVariables.push(...innerAggregatingVariables);
            if (preComputedSubqueries && !preComputedSubqueries.empty)
                subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
            return;
        }
    });
    // Implicit AND
    return {
        predicate: cypher_builder_1.default.and(...predicates),
        preComputedSubqueries: subqueries,
        requiredVariables,
        aggregatingVariables,
    };
}
exports.createWherePredicate = createWherePredicate;
function createNestedPredicate({ key, element, targetElement, context, value, listPredicateStr, requiredVariables, }) {
    const nested = [];
    const aggregatingVariables = [];
    let subqueries;
    value.forEach((v) => {
        const { predicate, preComputedSubqueries, requiredVariables: innerReturnVariables, aggregatingVariables: innerAggregatingVariables, } = createWherePredicate({
            whereInput: v,
            element,
            targetElement,
            context,
            listPredicateStr,
        });
        if (predicate) {
            nested.push(predicate);
        }
        requiredVariables.push(...innerReturnVariables);
        aggregatingVariables.push(...innerAggregatingVariables);
        if (preComputedSubqueries && !preComputedSubqueries.empty)
            subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
    });
    const logicalOperator = (0, logical_operators_1.getCypherLogicalOperator)(key);
    return { predicate: logicalOperator(...nested), preComputedSubqueries: subqueries, requiredVariables, aggregatingVariables };
}
//# sourceMappingURL=create-where-predicate.js.map