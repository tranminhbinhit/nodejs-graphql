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
exports.dateTimeAggregationQuery = exports.defaultAggregationQuery = exports.numberAggregationQuery = exports.stringAggregationQuery = exports.createMatchWherePattern = void 0;
const create_datetime_element_1 = require("../projection/elements/create-datetime-element");
const stringify_object_1 = require("../utils/stringify-object");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const graphql_compose_1 = require("graphql-compose");
function createMatchWherePattern(matchPattern, directed, preComputedWhereFields, auth, wherePredicate) {
    const matchClause = new cypher_builder_1.default.Match(matchPattern.pattern({ directed }));
    const whereClause = preComputedWhereFields && !preComputedWhereFields?.empty ? new cypher_builder_1.default.With("*") : matchClause;
    if (wherePredicate)
        whereClause.where(wherePredicate);
    if (auth)
        whereClause.where(auth);
    return preComputedWhereFields && !preComputedWhereFields?.empty
        ? cypher_builder_1.default.concat(matchClause, preComputedWhereFields, whereClause)
        : matchClause;
}
exports.createMatchWherePattern = createMatchWherePattern;
function stringAggregationQuery(matchWherePattern, fieldName, fieldRef, targetAlias) {
    const fieldPath = targetAlias.property(fieldName);
    return new cypher_builder_1.default.RawCypher((env) => {
        const targetAliasCypher = targetAlias.getCypher(env);
        const fieldPathCypher = fieldPath.getCypher(env);
        return (0, graphql_compose_1.dedent) `${matchWherePattern.getCypher(env)}
        WITH ${targetAliasCypher}
        ORDER BY size(${fieldPathCypher}) DESC
        WITH collect(${fieldPathCypher}) AS list
        RETURN { longest: head(list), shortest: last(list) } AS ${fieldRef.getCypher(env)}`;
    });
}
exports.stringAggregationQuery = stringAggregationQuery;
function numberAggregationQuery(matchWherePattern, fieldName, fieldRef, targetAlias) {
    const fieldPath = targetAlias.property(fieldName);
    return new cypher_builder_1.default.RawCypher((env) => {
        const fieldPathCypher = fieldPath.getCypher(env);
        return (0, graphql_compose_1.dedent) `${matchWherePattern.getCypher(env)}
        RETURN { min: min(${fieldPathCypher}), max: max(${fieldPathCypher}), average: avg(${fieldPathCypher}), sum: sum(${fieldPathCypher}) }  AS ${fieldRef.getCypher(env)}`;
    });
}
exports.numberAggregationQuery = numberAggregationQuery;
function defaultAggregationQuery(matchWherePattern, fieldName, fieldRef, targetAlias) {
    const fieldPath = targetAlias.property(fieldName);
    return new cypher_builder_1.default.RawCypher((env) => {
        const fieldPathCypher = fieldPath.getCypher(env);
        return (0, graphql_compose_1.dedent) `${matchWherePattern.getCypher(env)}
        RETURN { min: min(${fieldPathCypher}), max: max(${fieldPathCypher}) } AS ${fieldRef.getCypher(env)}`;
    });
}
exports.defaultAggregationQuery = defaultAggregationQuery;
function dateTimeAggregationQuery(matchWherePattern, fieldName, fieldRef, targetAlias) {
    const fieldPath = targetAlias.property(fieldName);
    return new cypher_builder_1.default.RawCypher((env) => {
        const fieldPathCypher = fieldPath.getCypher(env);
        return (0, graphql_compose_1.dedent) `${matchWherePattern.getCypher(env)}
        RETURN ${(0, stringify_object_1.stringifyObject)({
            min: new cypher_builder_1.default.RawCypher((0, create_datetime_element_1.wrapApocConvertDate)(`min(${fieldPathCypher})`)),
            max: new cypher_builder_1.default.RawCypher((0, create_datetime_element_1.wrapApocConvertDate)(`max(${fieldPathCypher})`)),
        }).getCypher(env)} AS ${fieldRef.getCypher(env)}`;
    });
}
exports.dateTimeAggregationQuery = dateTimeAggregationQuery;
//# sourceMappingURL=aggregation-sub-queries.js.map