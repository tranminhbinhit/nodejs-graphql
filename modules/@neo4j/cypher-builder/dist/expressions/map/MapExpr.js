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
exports.MapExpr = void 0;
const serialize_map_1 = require("../../utils/serialize-map");
/** Represents a Map
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/maps/)
 * @group Expressions
 */
class MapExpr {
    constructor(value = {}) {
        this.value = value;
    }
    set(keyOrValues, value) {
        if (typeof keyOrValues === "string") {
            this.value[keyOrValues] = value;
        }
        else {
            this.value = { ...this.value, ...keyOrValues };
        }
    }
    /**
     * @hidden
     */
    getCypher(env) {
        return (0, serialize_map_1.serializeMap)(env, this.value);
    }
}
exports.MapExpr = MapExpr;
//# sourceMappingURL=MapExpr.js.map