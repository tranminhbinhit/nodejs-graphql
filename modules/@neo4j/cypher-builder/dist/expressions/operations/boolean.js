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
exports.or = exports.not = exports.and = exports.BooleanOp = void 0;
const filter_truthy_1 = require("../../utils/filter-truthy");
const CypherASTNode_1 = require("../../CypherASTNode");
/**
 *  @group Internal
 */
class BooleanOp extends CypherASTNode_1.CypherASTNode {
    constructor(operator) {
        super();
        this.operator = operator;
    }
}
exports.BooleanOp = BooleanOp;
class BinaryOp extends BooleanOp {
    constructor(operator, left, right, ...extra) {
        super(operator);
        this.children = [left, right, ...extra];
        this.addChildren(...this.children);
    }
    getCypher(env) {
        const childrenStrs = this.children.map((c) => c.getCypher(env)).filter(Boolean);
        if (childrenStrs.length <= 1) {
            return childrenStrs.join("");
        }
        return `(${childrenStrs.join(` ${this.operator} `)})`;
    }
}
class NotOp extends BooleanOp {
    constructor(child) {
        super("NOT");
        this.child = child;
        this.addChildren(this.child);
    }
    getCypher(env) {
        const childStr = this.child.getCypher(env);
        // This check is just to avoid double parenthesis (e.g. "NOT ((a AND b))" ), both options are valid cypher
        if (this.child instanceof BinaryOp) {
            return `${this.operator} ${childStr}`;
        }
        return `${this.operator} (${childStr})`;
    }
}
function and(...ops) {
    const filteredPredicates = (0, filter_truthy_1.filterTruthy)(ops);
    const predicate1 = filteredPredicates.shift();
    const predicate2 = filteredPredicates.shift();
    if (predicate1 && predicate2) {
        return new BinaryOp("AND", predicate1, predicate2, ...filteredPredicates);
    }
    return predicate1;
}
exports.and = and;
/** Generates an `NOT` operator before the given predicate
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean)
 * @group Expressions
 * @category Operators
 * @example
 * ```ts
 * console.log("Test", Cypher.not(
 *     Cypher.eq(new Cypher.Literal("Hi"), new Cypher.Literal("Hi"))
 * );
 * ```
 * Translates to
 * ```cypher
 * NOT "Hi" = "Hi"
 * ```
 *
 */
function not(child) {
    return new NotOp(child);
}
exports.not = not;
function or(...ops) {
    const filteredPredicates = (0, filter_truthy_1.filterTruthy)(ops);
    const predicate1 = filteredPredicates.shift();
    const predicate2 = filteredPredicates.shift();
    if (predicate1 && predicate2) {
        return new BinaryOp("OR", predicate1, predicate2, ...filteredPredicates);
    }
    return predicate1;
}
exports.or = or;
//# sourceMappingURL=boolean.js.map