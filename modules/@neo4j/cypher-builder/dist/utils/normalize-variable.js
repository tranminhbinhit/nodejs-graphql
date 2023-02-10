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
exports.normalizeVariable = void 0;
const Literal_1 = require("../references/Literal");
const is_cypher_compilable_1 = require("./is-cypher-compilable");
function normalizeVariable(value) {
    if ((0, is_cypher_compilable_1.isCypherCompilable)(value))
        return value;
    return new Literal_1.Literal(value);
}
exports.normalizeVariable = normalizeVariable;
//# sourceMappingURL=normalize-variable.js.map