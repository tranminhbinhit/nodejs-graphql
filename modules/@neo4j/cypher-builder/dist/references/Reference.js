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
exports.Reference = void 0;
const PropertyRef_1 = require("./PropertyRef");
const ListIndex_1 = require("../expressions/list/ListIndex");
/** Represents a reference that will be kept in the environment */
class Reference {
    constructor(prefix = "") {
        this.prefix = prefix;
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const id = env.getReferenceId(this);
        return `${id}`;
    }
    /** Access individual property via the PropertyRef class, using the dot notation */
    property(path) {
        return new PropertyRef_1.PropertyRef(this, path);
    }
    /* Access individual elements via the ListIndex class, using the square bracket notation */
    index(index) {
        return new ListIndex_1.ListIndex(this, index);
    }
}
exports.Reference = Reference;
//# sourceMappingURL=Reference.js.map