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
exports.Case = void 0;
const CypherASTNode_1 = require("../CypherASTNode");
const pad_block_1 = require("../utils/pad-block");
const compile_cypher_if_exists_1 = require("../utils/compile-cypher-if-exists");
/** Case statement
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#query-syntax-case)
 * @group Expressions
 */
class Case extends CypherASTNode_1.CypherASTNode {
    constructor(comparator) {
        super();
        this.whenClauses = [];
        this.comparator = comparator;
    }
    when(expr) {
        const whenClause = new When(this, expr);
        this.whenClauses.push(whenClause);
        return whenClause;
    }
    else(defaultExpr) {
        this.default = defaultExpr;
        return this;
    }
    getCypher(env) {
        const comparatorStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.comparator, env, { prefix: " " });
        const whenStr = this.whenClauses.map((c) => c.getCypher(env)).join("\n");
        const defaultStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.default, env, { prefix: "\nELSE " });
        const innerStr = (0, pad_block_1.padBlock)(`${whenStr}${defaultStr}`);
        return `CASE${comparatorStr}\n${innerStr}\nEND`;
    }
}
exports.Case = Case;
class When extends CypherASTNode_1.CypherASTNode {
    constructor(parent, predicate) {
        super();
        this.parent = parent;
        this.predicate = predicate;
    }
    then(expr) {
        this.result = expr;
        return this.parent;
    }
    getCypher(env) {
        const predicateStr = this.predicate.getCypher(env);
        if (!this.result)
            throw new Error("Cannot generate CASE ... WHEN statement without THEN");
        const resultStr = this.result.getCypher(env);
        return `WHEN ${predicateStr} THEN ${resultStr}`;
    }
}
//# sourceMappingURL=Case.js.map