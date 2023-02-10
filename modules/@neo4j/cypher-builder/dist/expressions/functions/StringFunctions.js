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
exports.trim = exports.toUpper = exports.toStringOrNull = exports.toString = exports.toLower = exports.substring = exports.split = exports.rTrim = exports.right = exports.reverse = exports.replace = exports.lTrim = exports.left = void 0;
const filter_truthy_1 = require("../../utils/filter-truthy");
const CypherFunction_1 = require("./CypherFunction");
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function left(original, length) {
    return new CypherFunction_1.CypherFunction("left", [original, length]);
}
exports.left = left;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function lTrim(original) {
    return new CypherFunction_1.CypherFunction("lTrim", [original]);
}
exports.lTrim = lTrim;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function replace(original, search, replace) {
    return new CypherFunction_1.CypherFunction("replace", [original, search, replace]);
}
exports.replace = replace;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function reverse(original) {
    return new CypherFunction_1.CypherFunction("reverse", [original]);
}
exports.reverse = reverse;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function right(original, length) {
    return new CypherFunction_1.CypherFunction("right", [original, length]);
}
exports.right = right;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function rTrim(original) {
    return new CypherFunction_1.CypherFunction("rTrim", [original]);
}
exports.rTrim = rTrim;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function split(original, delimiter) {
    return new CypherFunction_1.CypherFunction("split", [original, delimiter]);
}
exports.split = split;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function substring(original, start, length) {
    return new CypherFunction_1.CypherFunction("substring", (0, filter_truthy_1.filterTruthy)([original, start, length]));
}
exports.substring = substring;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function toLower(original) {
    return new CypherFunction_1.CypherFunction("toLower", [original]);
}
exports.toLower = toLower;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function toString(expression) {
    return new CypherFunction_1.CypherFunction("toString", [expression]);
}
exports.toString = toString;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function toStringOrNull(expression) {
    return new CypherFunction_1.CypherFunction("toStringOrNull", [expression]);
}
exports.toStringOrNull = toStringOrNull;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function toUpper(original) {
    return new CypherFunction_1.CypherFunction("toUpper", [original]);
}
exports.toUpper = toUpper;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
function trim(original) {
    return new CypherFunction_1.CypherFunction("trim", [original]);
}
exports.trim = trim;
//# sourceMappingURL=StringFunctions.js.map