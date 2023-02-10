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
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomUUID = exports.sum = exports.avg = exports.max = exports.min = exports.count = exports.cypherTime = exports.cypherLocalTime = exports.cypherLocalDatetime = exports.cypherDate = exports.cypherDatetime = exports.labels = exports.pointDistance = exports.distance = exports.point = exports.coalesce = exports.CypherFunction = void 0;
const CypherASTNode_1 = require("../../CypherASTNode");
/** Represents a Cypher Function
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/)
 * @group Expressions
 * @category Cypher Functions
 */
class CypherFunction extends CypherASTNode_1.CypherASTNode {
    /**
     * @hidden
     */
    constructor(name, params = []) {
        super();
        this.name = name;
        this.params = params;
        for (const param of params) {
            if (param instanceof CypherASTNode_1.CypherASTNode) {
                this.addChildren(param);
            }
        }
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const argsStr = this.params.map((expr) => expr.getCypher(env)).join(", ");
        return `${this.name}(${argsStr})`;
    }
}
exports.CypherFunction = CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-coalesce)
 * @group Expressions
 * @category Cypher Functions
 */
function coalesce(expr, ...optionalExpr) {
    return new CypherFunction("coalesce", [expr, ...optionalExpr]);
}
exports.coalesce = coalesce;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/spatial/)
 * @group Expressions
 * @category Cypher Functions
 */
function point(variable) {
    return new CypherFunction("point", [variable]);
}
exports.point = point;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/4.3/functions/spatial/#functions-distance)
 * @group Expressions
 * @category Cypher Functions
 * @deprecated No longer supported in Neo4j 5. Use {@link pointDistance} instead.
 */
function distance(lexpr, rexpr) {
    return new CypherFunction("distance", [lexpr, rexpr]);
}
exports.distance = distance;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/spatial/#functions-distance)
 * @group Expressions
 * @category Cypher Functions
 */
function pointDistance(lexpr, rexpr) {
    return new CypherFunction("point.distance", [lexpr, rexpr]);
}
exports.pointDistance = pointDistance;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-labels)
 * @group Expressions
 * @category Cypher Functions
 */
function labels(nodeRef) {
    return new CypherFunction("labels", [nodeRef]);
}
exports.labels = labels;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-datetime)
 * @group Expressions
 * @category Cypher Functions
 */
function cypherDatetime() {
    return new CypherFunction("datetime");
}
exports.cypherDatetime = cypherDatetime;
// TODO: Add optional input to date functions - https://neo4j.com/docs/cypher-manual/current/functions/#header-query-functions-temporal-instant-types
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-date)
 * @group Expressions
 * @category Cypher Functions
 */
function cypherDate() {
    return new CypherFunction("date");
}
exports.cypherDate = cypherDate;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-coalesce)
 * @group Expressions
 * @category Cypher Functions
 */
function cypherLocalDatetime() {
    return new CypherFunction("localdatetime");
}
exports.cypherLocalDatetime = cypherLocalDatetime;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localdatetime)
 * @group Expressions
 * @category Cypher Functions
 */
function cypherLocalTime() {
    return new CypherFunction("localtime");
}
exports.cypherLocalTime = cypherLocalTime;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-time)
 * @group Expressions
 * @category Cypher Functions
 */
function cypherTime() {
    return new CypherFunction("time");
}
exports.cypherTime = cypherTime;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-count)
 * @group Expressions
 * @category Cypher Functions
 */
function count(expr) {
    return new CypherFunction("count", [expr]);
}
exports.count = count;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-min)
 * @group Expressions
 * @category Cypher Functions
 */
function min(expr) {
    return new CypherFunction("min", [expr]);
}
exports.min = min;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-max)
 * @group Expressions
 * @category Cypher Functions
 */
function max(expr) {
    return new CypherFunction("max", [expr]);
}
exports.max = max;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg)
 * @group Expressions
 * @category Cypher Functions
 */
function avg(expr) {
    return new CypherFunction("avg", [expr]);
}
exports.avg = avg;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-sum)
 * @group Expressions
 * @category Cypher Functions
 */
function sum(expr) {
    return new CypherFunction("sum", [expr]);
}
exports.sum = sum;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-randomuuid)
 * @group Expressions
 * @category Cypher Functions
 */
function randomUUID() {
    return new CypherFunction("randomUUID");
}
exports.randomUUID = randomUUID;
//# sourceMappingURL=CypherFunction.js.map