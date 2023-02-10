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
exports.MapProjection = void 0;
const serialize_map_1 = require("../../utils/serialize-map");
/** Represents a Map projection
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/maps/#cypher-map-projection)
 * @group Expressions
 * @example
 * ```cypher
 * this { .title }
 * ```
 */
class MapProjection {
    constructor(variable, projection, extraValues = {}) {
        this.variable = variable;
        this.projection = projection;
        this.extraValues = extraValues;
    }
    set(values) {
        if (values instanceof String) {
            this.projection.push(values);
        }
        else {
            this.extraValues = { ...this.extraValues, ...values };
        }
    }
    getCypher(env) {
        const variableStr = this.variable.getCypher(env);
        const extraValuesStr = (0, serialize_map_1.serializeMap)(env, this.extraValues, true);
        const projectionStr = this.projection.join(", ");
        const commaStr = extraValuesStr && projectionStr ? ", " : "";
        return `${variableStr} { ${projectionStr}${commaStr}${extraValuesStr} }`;
    }
}
exports.MapProjection = MapProjection;
//# sourceMappingURL=MapProjection.js.map