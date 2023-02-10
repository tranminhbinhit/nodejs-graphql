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
exports.CypherASTNode = void 0;
/** Abstract class representing a Cypher Statement in the AST
 * @hidden
 */
class CypherASTNode {
    /**
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * @hidden
     */
    getRoot() {
        if (this.parent) {
            return this.parent.getRoot();
        }
        return this;
    }
    /** Sets the parent-child relationship for build traversal */
    addChildren(...nodes) {
        for (const node of nodes) {
            if (node instanceof CypherASTNode) {
                node.setParent(this);
            }
        }
    }
    setParent(node) {
        this.parent = node;
    }
    get isRoot() {
        return this.parent === undefined;
    }
}
exports.CypherASTNode = CypherASTNode;
//# sourceMappingURL=CypherASTNode.js.map