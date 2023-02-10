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
exports.reduce = exports.last = exports.head = exports.collect = exports.size = void 0;
const CypherFunction_1 = require("./CypherFunction");
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-size)
 * @group Expressions
 * @category Cypher Functions
 */
function size(expr) {
    return new CypherFunction_1.CypherFunction("size", [expr]);
}
exports.size = size;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-collect)
 * @group Expressions
 * @category Cypher Functions
 */
function collect(expr) {
    return new CypherFunction_1.CypherFunction("collect", [expr]);
}
exports.collect = collect;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-head)
 * @group Expressions
 * @category Cypher Functions
 */
function head(expr) {
    return new CypherFunction_1.CypherFunction("head", [expr]);
}
exports.head = head;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-last)
 * @group Expressions
 * @category Cypher Functions
 */
function last(expr) {
    return new CypherFunction_1.CypherFunction("last", [expr]);
}
exports.last = last;
class ReducerFunction extends CypherFunction_1.CypherFunction {
    constructor({ accVariable, defaultValue, variable, listExpr, mapExpr, }) {
        super("reduce");
        this.accVariable = accVariable;
        this.defaultValue = defaultValue;
        this.variable = variable;
        this.listExpr = listExpr;
        this.mapExpr = mapExpr;
    }
    getCypher(env) {
        const accStr = `${this.accVariable.getCypher(env)} = ${this.defaultValue.getCypher(env)}`;
        const variableStr = this.variable.getCypher(env);
        const listExprStr = this.listExpr.getCypher(env);
        const mapExprStr = this.mapExpr.getCypher(env);
        return `${this.name}(${accStr}, ${variableStr} IN ${listExprStr} | ${mapExprStr})`;
    }
}
/** Reduce a list by executing given expression.
 * ```cypher
 * reduce(totalAge = 0, n IN nodes(p) | totalAge + n.age)
 * ```
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-reduce)
 * @group Expressions
 * @category Cypher Functions
 */
function reduce(accVariable, defaultValue, variable, listExpr, mapExpr) {
    return new ReducerFunction({
        accVariable,
        defaultValue,
        variable,
        listExpr,
        mapExpr,
    });
}
exports.reduce = reduce;
//# sourceMappingURL=ListFunctions.js.map