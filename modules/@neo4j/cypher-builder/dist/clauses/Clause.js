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
exports.Clause = void 0;
const CypherASTNode_1 = require("../CypherASTNode");
const Environment_1 = require("../Environment");
const convert_to_cypher_params_1 = require("../utils/convert-to-cypher-params");
const pad_block_1 = require("../utils/pad-block");
const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
/** Represents a clause AST node
 *  @group Internal
 */
class Clause extends CypherASTNode_1.CypherASTNode {
    /** Compiles a clause into Cypher and params */
    build(prefix, extraParams = {}) {
        if (this.isRoot) {
            const env = this.getEnv(prefix);
            const cypher = this.getCypher(env);
            const cypherParams = (0, convert_to_cypher_params_1.convertToCypherParams)(extraParams);
            env.addExtraParams(cypherParams);
            return {
                cypher,
                params: env.getParams(),
            };
        }
        const root = this.getRoot();
        return root.build(prefix, extraParams);
    }
    getEnv(prefix) {
        return new Environment_1.CypherEnvironment(prefix);
    }
    /** Custom string for browsers and templating
     * @hidden
     */
    toString() {
        const cypher = (0, pad_block_1.padBlock)(this.build().cypher);
        return `<Clause ${this.constructor.name}> """\n${cypher}\n"""`;
    }
    /** Custom log for console.log in Node
     * @hidden
     */
    [customInspectSymbol]() {
        return this.toString();
    }
}
exports.Clause = Clause;
//# sourceMappingURL=Clause.js.map