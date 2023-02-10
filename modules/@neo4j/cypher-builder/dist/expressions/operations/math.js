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
exports.minus = exports.plus = exports.MathOp = void 0;
const CypherASTNode_1 = require("../../CypherASTNode");
class MathOp extends CypherASTNode_1.CypherASTNode {
    constructor(operator, exprs = []) {
        super();
        this.operator = operator;
        this.exprs = exprs;
    }
    getCypher(env) {
        const exprs = this.exprs.map((e) => e.getCypher(env));
        return exprs.join(` ${this.operator} `);
    }
}
exports.MathOp = MathOp;
function createOp(op, exprs) {
    return new MathOp(op, exprs);
}
function plus(...exprs) {
    return createOp("+", exprs);
}
exports.plus = plus;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-mathematical)
 * @group Expressions
 * @category Operators
 */
function minus(leftExpr, rightExpr) {
    return createOp("-", [leftExpr, rightExpr]);
}
exports.minus = minus;
//# sourceMappingURL=math.js.map