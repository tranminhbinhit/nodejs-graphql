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
exports.RelationshipRef = void 0;
const Pattern_1 = require("../Pattern");
const Reference_1 = require("./Reference");
/** Reference to a relationship property
 * @group References
 */
class RelationshipRef extends Reference_1.Reference {
    constructor(input) {
        super("this");
        this._type = input.type || undefined;
        this._source = input.source;
        this._target = input.target;
    }
    get source() {
        return this._source;
    }
    get target() {
        return this._target;
    }
    get type() {
        return this._type;
    }
    /** Sets the type of the relationship */
    withType(type) {
        this._type = type;
        return this;
    }
    /** Reverses the direction of the relationship */
    reverse() {
        const oldTarget = this._target;
        this._target = this._source;
        this._source = oldTarget;
    }
    /** Creates a new Pattern from this relationship */
    pattern(options = {}) {
        return new Pattern_1.Pattern(this, options);
    }
}
exports.RelationshipRef = RelationshipRef;
//# sourceMappingURL=RelationshipRef.js.map