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
exports.Exists = void 0;
const CypherASTNode_1 = require("../CypherASTNode");
const pad_block_1 = require("../utils/pad-block");
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#existential-subqueries)
 * @group Expressions
 */
class Exists extends CypherASTNode_1.CypherASTNode {
    constructor(subQuery, parent) {
        super(parent);
        const rootQuery = subQuery.getRoot();
        this.addChildren(rootQuery);
        this.subQuery = rootQuery;
    }
    getCypher(env) {
        const subQueryStr = this.subQuery.getCypher(env);
        const paddedSubQuery = (0, pad_block_1.padBlock)(subQueryStr);
        return `EXISTS {\n${paddedSubQuery}\n}`;
    }
}
exports.Exists = Exists;
//# sourceMappingURL=Exists.js.map