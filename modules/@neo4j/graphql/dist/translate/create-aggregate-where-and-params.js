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
exports.aggregatePreComputedWhereFields = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const utils_1 = require("./where/utils");
const create_comparison_operation_1 = require("./where/property-operations/create-comparison-operation");
const constants_1 = require("../constants");
const logical_operators_1 = require("./utils/logical-operators");
const map_to_db_property_1 = __importDefault(require("../utils/map-to-db-property"));
const utils_2 = require("../utils/utils");
function aggregatePreComputedWhereFields(value, relationField, relationship, context, matchNode, listPredicateStr) {
    const refNode = context.nodes.find((x) => x.name === relationField.typeMeta.name);
    const direction = relationField.direction;
    const aggregationTarget = new cypher_builder_1.default.Node({ labels: refNode.getLabels(context) });
    const cypherRelation = new cypher_builder_1.default.Relationship({
        source: matchNode,
        target: aggregationTarget,
        type: relationField.type,
    });
    let matchPattern = cypherRelation.pattern({ source: { labels: false } });
    if (direction === "IN") {
        cypherRelation.reverse();
        matchPattern = cypherRelation.pattern({ target: { labels: false } });
    }
    const matchQuery = new cypher_builder_1.default.Match(matchPattern);
    const { returnProjections, predicates, returnVariables } = aggregateWhere(value, refNode, relationship, aggregationTarget, cypherRelation, listPredicateStr, context);
    matchQuery.return(...returnProjections);
    const subquery = new cypher_builder_1.default.Call(matchQuery).innerWith(matchNode);
    // The return values are needed when performing SOME/NONE/ALL/SINGLE operations as they need to be aggregated to perform comparisons
    if (listPredicateStr) {
        return {
            predicate: cypher_builder_1.default.and(...predicates),
            // Cypher.concat is used because this is passed to createWherePredicate which expects a Cypher.CompositeClause
            preComputedSubqueries: cypher_builder_1.default.concat(subquery),
            requiredVariables: [],
            aggregatingVariables: returnVariables,
        };
    }
    return {
        predicate: cypher_builder_1.default.and(...predicates),
        // Cypher.concat is used because this is passed to createWherePredicate which expects a Cypher.CompositeClause
        preComputedSubqueries: cypher_builder_1.default.concat(subquery),
        requiredVariables: returnVariables,
        aggregatingVariables: [],
    };
}
exports.aggregatePreComputedWhereFields = aggregatePreComputedWhereFields;
function aggregateWhere(aggregateWhereInput, refNode, relationship, aggregationTarget, cypherRelation, listPredicateStr, context) {
    const returnProjections = [];
    const predicates = [];
    const returnVariables = [];
    Object.entries(aggregateWhereInput).forEach(([key, value]) => {
        if (constants_1.AGGREGATION_AGGREGATE_COUNT_OPERATORS.includes(key)) {
            const { returnProjection: innerReturnProjection, predicate: innerPredicate, returnVariable: innerReturnVariable, } = createCountPredicateAndProjection(aggregationTarget, key, value, listPredicateStr);
            returnProjections.push(innerReturnProjection);
            if (innerPredicate)
                predicates.push(innerPredicate);
            returnVariables.push(innerReturnVariable);
        }
        else if (constants_1.NODE_OR_EDGE_KEYS.includes(key)) {
            const target = key === "edge" ? cypherRelation : aggregationTarget;
            const refNodeOrRelation = key === "edge" ? relationship : refNode;
            if (!refNodeOrRelation)
                throw new Error(`Edge filter ${key} on undefined relationship`);
            const { returnProjections: innerReturnProjections, predicates: innerPredicates, returnVariables: innerReturnVariables, } = aggregateEntityWhere(value, refNodeOrRelation, target, listPredicateStr, context);
            returnProjections.push(...innerReturnProjections);
            predicates.push(...innerPredicates);
            returnVariables.push(...innerReturnVariables);
        }
        else if ((0, logical_operators_1.isLogicalOperator)(key)) {
            const cypherBuilderFunction = (0, logical_operators_1.getCypherLogicalOperator)(key);
            const logicalPredicates = [];
            (0, utils_2.asArray)(value).forEach((whereInput) => {
                const { returnProjections: innerReturnProjections, predicates: innerPredicates, returnVariables: innerReturnVariables, } = aggregateWhere(whereInput, refNode, relationship, aggregationTarget, cypherRelation, listPredicateStr, context);
                returnProjections.push(...innerReturnProjections);
                logicalPredicates.push(...innerPredicates);
                returnVariables.push(...innerReturnVariables);
            });
            predicates.push(cypherBuilderFunction(...logicalPredicates));
        }
    });
    return {
        returnProjections,
        predicates,
        returnVariables,
    };
}
function createCountPredicateAndProjection(aggregationTarget, filterKey, filterValue, listPredicateStr) {
    const paramName = new cypher_builder_1.default.Param(filterValue);
    const count = cypher_builder_1.default.count(aggregationTarget);
    const operator = utils_1.whereRegEx.exec(filterKey)?.groups?.operator || "EQ";
    const operation = (0, create_comparison_operation_1.createBaseOperation)({
        operator,
        property: count,
        param: paramName,
    });
    const operationVar = new cypher_builder_1.default.Variable();
    return {
        returnProjection: [operation, operationVar],
        predicate: getReturnValuePredicate(operationVar, listPredicateStr),
        returnVariable: operationVar,
    };
}
function aggregateEntityWhere(aggregateEntityWhereInput, refNodeOrRelation, target, listPredicateStr, context) {
    const returnProjections = [];
    const predicates = [];
    const returnVariables = [];
    Object.entries(aggregateEntityWhereInput).forEach(([key, value]) => {
        if ((0, logical_operators_1.isLogicalOperator)(key)) {
            const cypherBuilderFunction = (0, logical_operators_1.getCypherLogicalOperator)(key);
            const logicalPredicates = [];
            (0, utils_2.asArray)(value).forEach((whereInput) => {
                const { returnProjections: innerReturnProjections, predicates: innerPredicates, returnVariables: innerReturnVariables, } = aggregateEntityWhere(whereInput, refNodeOrRelation, target, listPredicateStr, context);
                returnProjections.push(...innerReturnProjections);
                logicalPredicates.push(...innerPredicates);
                returnVariables.push(...innerReturnVariables);
            });
            predicates.push(cypherBuilderFunction(...logicalPredicates));
        }
        else {
            const operation = createEntityOperation(refNodeOrRelation, target, key, value, context);
            const operationVar = new cypher_builder_1.default.Variable();
            returnProjections.push([operation, operationVar]);
            predicates.push(getReturnValuePredicate(operationVar, listPredicateStr));
            returnVariables.push(operationVar);
        }
    });
    return {
        returnProjections,
        predicates,
        returnVariables,
    };
}
function createEntityOperation(refNodeOrRelation, target, aggregationInputField, aggregationInputValue, context) {
    const paramName = new cypher_builder_1.default.Param(aggregationInputValue);
    const regexResult = utils_1.aggregationFieldRegEx.exec(aggregationInputField)?.groups;
    const { logicalOperator } = regexResult;
    const { fieldName, aggregationOperator } = regexResult;
    const fieldType = refNodeOrRelation?.primitiveFields.find((name) => name.fieldName === fieldName)?.typeMeta.name;
    if (fieldType === "String" && aggregationOperator) {
        return (0, create_comparison_operation_1.createBaseOperation)({
            operator: logicalOperator || "EQ",
            property: getAggregateOperation(cypher_builder_1.default.size(target.property(fieldName)), aggregationOperator),
            param: paramName,
        });
    }
    else if (aggregationOperator) {
        return (0, create_comparison_operation_1.createBaseOperation)({
            operator: logicalOperator || "EQ",
            property: getAggregateOperation(target.property(fieldName), aggregationOperator),
            param: paramName,
        });
    }
    else {
        const innerVar = new cypher_builder_1.default.Variable();
        const pointField = refNodeOrRelation.pointFields.find((x) => x.fieldName === fieldName);
        const durationField = refNodeOrRelation.primitiveFields.find((x) => x.fieldName === fieldName && x.typeMeta.name === "Duration");
        const innerOperation = (0, create_comparison_operation_1.createComparisonOperation)({
            operator: logicalOperator || "EQ",
            propertyRefOrCoalesce: innerVar,
            param: paramName,
            durationField,
            pointField,
            neo4jDatabaseInfo: context.neo4jDatabaseInfo,
        });
        const dbFieldName = (0, map_to_db_property_1.default)(refNodeOrRelation, fieldName);
        const collectedProperty = fieldType === "String" && logicalOperator !== "EQUAL"
            ? cypher_builder_1.default.collect(cypher_builder_1.default.size(target.property(dbFieldName)))
            : cypher_builder_1.default.collect(target.property(dbFieldName));
        return cypher_builder_1.default.any(innerVar, collectedProperty, innerOperation);
    }
}
function getAggregateOperation(property, aggregationOperator) {
    switch (aggregationOperator) {
        case "AVERAGE":
            return cypher_builder_1.default.avg(property);
        case "MIN":
        case "SHORTEST":
            return cypher_builder_1.default.min(property);
        case "MAX":
        case "LONGEST":
            return cypher_builder_1.default.max(property);
        case "SUM":
            return cypher_builder_1.default.sum(property);
        default:
            throw new Error(`Invalid operator ${aggregationOperator}`);
    }
}
function getReturnValuePredicate(operationVar, listPredicateStr) {
    switch (listPredicateStr) {
        case "all": {
            const listVar = new cypher_builder_1.default.Variable();
            return cypher_builder_1.default.all(listVar, operationVar, cypher_builder_1.default.eq(listVar, new cypher_builder_1.default.Literal(true)));
        }
        case "single": {
            const listVar = new cypher_builder_1.default.Variable();
            return cypher_builder_1.default.single(listVar, operationVar, cypher_builder_1.default.eq(listVar, new cypher_builder_1.default.Literal(true)));
        }
        case "not":
        case "none":
        case "any": {
            return cypher_builder_1.default.in(new cypher_builder_1.default.Literal(true), operationVar);
        }
        default: {
            return cypher_builder_1.default.eq(operationVar, new cypher_builder_1.default.Literal(true));
        }
    }
}
//# sourceMappingURL=create-aggregate-where-and-params.js.map