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
exports.NamedNode = exports.NodeRef = void 0;
const HasLabel_1 = require("../expressions/HasLabel");
const Pattern_1 = require("../Pattern");
const Reference_1 = require("./Reference");
const RelationshipRef_1 = require("./RelationshipRef");
/** Represents a node reference
 * @group References
 */
class NodeRef extends Reference_1.Reference {
    constructor(options = {}) {
        super("this");
        this.labels = options.labels || [];
    }
    relatedTo(node) {
        return new RelationshipRef_1.RelationshipRef({
            source: this,
            target: node,
        });
    }
    hasLabels(...labels) {
        return new HasLabel_1.HasLabel(this, labels);
    }
    hasLabel(label) {
        return new HasLabel_1.HasLabel(this, [label]);
    }
    /** Creates a new Pattern from this node */
    pattern(options = {}) {
        return new Pattern_1.Pattern(this, options);
    }
}
exports.NodeRef = NodeRef;
/** Represents a node reference with a given name
 * @group References
 */
class NamedNode extends NodeRef {
    constructor(id, options) {
        super(options || {});
        this.id = id;
    }
    get name() {
        return this.id;
    }
}
exports.NamedNode = NamedNode;
//# sourceMappingURL=NodeRef.js.map