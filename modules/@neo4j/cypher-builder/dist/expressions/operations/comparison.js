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
exports.matches = exports.endsWith = exports.startsWith = exports.contains = exports.inOp = exports.isNotNull = exports.isNull = exports.lte = exports.lt = exports.gte = exports.gt = exports.eq = exports.ComparisonOp = void 0;
const CypherASTNode_1 = require("../../CypherASTNode");
/**
 *  @group Internal
 */
class ComparisonOp extends CypherASTNode_1.CypherASTNode {
    constructor(operator, left, right) {
        super();
        this.operator = operator;
        this.leftExpr = left;
        this.rightExpr = right;
    }
    getCypher(env) {
        const leftStr = this.leftExpr ? `${this.leftExpr.getCypher(env)} ` : "";
        const rightStr = this.rightExpr ? ` ${this.rightExpr.getCypher(env)}` : "";
        return `${leftStr}${this.operator}${rightStr}`;
    }
}
exports.ComparisonOp = ComparisonOp;
function createOp(op, leftExpr, rightExpr) {
    return new ComparisonOp(op, leftExpr, rightExpr);
}
/** Generates an equal (=) operator between the 2 expressions
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function eq(leftExpr, rightExpr) {
    return createOp("=", leftExpr, rightExpr);
}
exports.eq = eq;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function gt(leftExpr, rightExpr) {
    return createOp(">", leftExpr, rightExpr);
}
exports.gt = gt;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function gte(leftExpr, rightExpr) {
    return createOp(">=", leftExpr, rightExpr);
}
exports.gte = gte;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function lt(leftExpr, rightExpr) {
    return createOp("<", leftExpr, rightExpr);
}
exports.lt = lt;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function lte(leftExpr, rightExpr) {
    return createOp("<=", leftExpr, rightExpr);
}
exports.lte = lte;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function isNull(childExpr) {
    return createOp("IS NULL", childExpr);
}
exports.isNull = isNull;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function isNotNull(childExpr) {
    return createOp("IS NOT NULL", childExpr);
}
exports.isNotNull = isNotNull;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function inOp(leftExpr, rightExpr) {
    return createOp("IN", leftExpr, rightExpr);
}
exports.inOp = inOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function contains(leftExpr, rightExpr) {
    return createOp("CONTAINS", leftExpr, rightExpr);
}
exports.contains = contains;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function startsWith(leftExpr, rightExpr) {
    return createOp("STARTS WITH", leftExpr, rightExpr);
}
exports.startsWith = startsWith;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function endsWith(leftExpr, rightExpr) {
    return createOp("ENDS WITH", leftExpr, rightExpr);
}
exports.endsWith = endsWith;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
function matches(leftExpr, rightExpr) {
    return createOp("=~", leftExpr, rightExpr);
}
exports.matches = matches;
//# sourceMappingURL=comparison.js.map