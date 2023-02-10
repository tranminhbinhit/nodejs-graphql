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
exports.PropertyRef = void 0;
/** Reference to a variable property
 * @group References
 * @example new Node({labels: ["Movie"]}).property("title")
 */
class PropertyRef {
    constructor(variable, ...properties) {
        this._variable = variable;
        this.propertyPath = properties;
    }
    get variable() {
        return this._variable;
    }
    /** Access individual property via the PropertyRef class, using the dot notation */
    property(prop) {
        return new PropertyRef(this._variable, ...this.propertyPath, prop);
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const variableStr = this.variable.getCypher(env);
        const propStr = this.propertyPath.map((prop) => this.getPropertyCypher(prop, env)).join("");
        return `${variableStr}${propStr}`;
    }
    getPropertyCypher(prop, env) {
        if (typeof prop === "string") {
            return `.${prop}`;
        }
        else {
            const exprStr = prop.getCypher(env);
            return `[${exprStr}]`;
        }
    }
}
exports.PropertyRef = PropertyRef;
//# sourceMappingURL=PropertyRef.js.map