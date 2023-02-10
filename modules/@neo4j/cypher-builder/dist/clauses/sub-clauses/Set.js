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
exports.SetClause = void 0;
const CypherASTNode_1 = require("../../CypherASTNode");
const pad_block_1 = require("../../utils/pad-block");
class SetClause extends CypherASTNode_1.CypherASTNode {
    constructor(parent, params = []) {
        super(parent);
        this.params = params;
    }
    addParams(...params) {
        this.params.push(...params);
    }
    getCypher(env) {
        if (this.params.length === 0)
            return "";
        const paramsStr = this.params
            .map((param) => {
            return this.composeParam(env, param);
        })
            .join(",\n");
        return `SET\n${(0, pad_block_1.padBlock)(paramsStr)}`;
    }
    composeParam(env, [ref, param]) {
        return `${ref.getCypher(env)} = ${param.getCypher(env)}`;
    }
}
exports.SetClause = SetClause;
//# sourceMappingURL=Set.js.map