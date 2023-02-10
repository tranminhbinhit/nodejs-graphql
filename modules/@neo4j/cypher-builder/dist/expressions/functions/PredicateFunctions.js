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
exports.exists = exports.single = exports.all = exports.any = exports.PredicateFunction = void 0;
const Where_1 = require("../../clauses/sub-clauses/Where");
const compile_cypher_if_exists_1 = require("../../utils/compile-cypher-if-exists");
const CypherFunction_1 = require("./CypherFunction");
/** Represents a predicate function that can be used in a WHERE statement
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/predicate/)
 * @group Internal
 */
class PredicateFunction extends CypherFunction_1.CypherFunction {
}
exports.PredicateFunction = PredicateFunction;
/** Predicate function that uses a list comprehension "var IN list WHERE .." */
class ListPredicateFunction extends PredicateFunction {
    constructor(name, variable, listExpr, whereFilter) {
        super(name);
        this.variable = variable;
        this.listExpr = listExpr;
        if (whereFilter) {
            this.whereSubClause = new Where_1.Where(this, whereFilter);
        }
    }
    getCypher(env) {
        const whereStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.whereSubClause, env, { prefix: " " });
        const listExprStr = this.listExpr.getCypher(env);
        const varCypher = this.variable.getCypher(env);
        return `${this.name}(${varCypher} IN ${listExprStr}${whereStr})`;
    }
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-any)
 * @group Expressions
 * @category Cypher Functions
 */
function any(variable, listExpr, whereFilter) {
    return new ListPredicateFunction("any", variable, listExpr, whereFilter);
}
exports.any = any;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-all)
 * @group Expressions
 * @category Cypher Functions
 */
function all(variable, listExpr, whereFilter) {
    return new ListPredicateFunction("all", variable, listExpr, whereFilter);
}
exports.all = all;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-single)
 * @group Expressions
 * @category Cypher Functions
 */
function single(variable, listExpr, whereFilter) {
    return new ListPredicateFunction("single", variable, listExpr, whereFilter);
}
exports.single = single;
class ExistsFunction extends PredicateFunction {
    constructor(pattern) {
        super("exists");
        this.pattern = pattern;
    }
    getCypher(env) {
        const patternStr = this.pattern.getCypher(env);
        return `exists(${patternStr})`;
    }
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-exists)
 * @group Expressions
 * @category Cypher Functions
 */
function exists(pattern) {
    return new ExistsFunction(pattern);
}
exports.exists = exists;
//# sourceMappingURL=PredicateFunctions.js.map