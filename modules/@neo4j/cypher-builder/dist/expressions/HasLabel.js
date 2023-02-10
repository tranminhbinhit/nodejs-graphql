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
exports.HasLabel = void 0;
const CypherASTNode_1 = require("../CypherASTNode");
const escape_label_1 = require("../utils/escape-label");
/** Generates a predicate to check if a node has a label
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#existential-subqueries)
 * @group Expressions
 * @example
 * ```cypher
 * MATCH(this) WHERE this:MyNode
 * ```
 */
class HasLabel extends CypherASTNode_1.CypherASTNode {
    constructor(node, expectedLabels) {
        super();
        if (expectedLabels.length === 0)
            throw new Error("HasLabel needs at least 1 label");
        this.node = node;
        this.expectedLabels = expectedLabels;
    }
    getCypher(env) {
        const nodeId = this.node.getCypher(env);
        const labelsStr = this.expectedLabels
            .map((label) => {
            return `:${(0, escape_label_1.escapeLabel)(label)}`;
        })
            .join("");
        return `${nodeId}${labelsStr}`;
    }
}
exports.HasLabel = HasLabel;
//# sourceMappingURL=HasLabel.js.map