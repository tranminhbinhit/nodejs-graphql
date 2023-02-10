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
exports.CypherEnvironment = void 0;
const Param_1 = require("./references/Param");
/** Hold the internal references of Cypher parameters and variables
 *  @group Internal
 */
class CypherEnvironment {
    /**
     *  @hidden
     */
    constructor(prefix) {
        this.references = new Map();
        this.params = [];
        if (!prefix || typeof prefix === "string") {
            this.globalPrefix = {
                params: prefix || "",
                variables: prefix || "",
            };
        }
        else {
            this.globalPrefix = {
                params: prefix.params || "",
                variables: prefix.variables || "",
            };
        }
    }
    getReferenceId(reference) {
        if (this.isNamedReference(reference))
            return reference.id; // Overrides ids for compatibility reasons
        const id = this.references.get(reference);
        if (!id) {
            return this.addVariableReference(reference);
        }
        return id;
    }
    getParams() {
        return this.params.reduce((acc, param) => {
            const key = this.getReferenceId(param);
            if (param.hasValue) {
                acc[key] = param.value;
            }
            return acc;
        }, {});
    }
    addNamedParamReference(name, param) {
        if (!this.references.has(param)) {
            this.addParam(name, param);
        }
    }
    addExtraParams(params) {
        Object.entries(params).forEach(([key, param]) => {
            this.addNamedParamReference(key, param);
        });
    }
    getParamsSize() {
        return this.params.length;
    }
    getReferences() {
        return this.references;
    }
    addParam(id, param) {
        const paramId = id;
        this.references.set(param, paramId);
        this.params.push(param);
        return paramId;
    }
    addVariableReference(variable) {
        const paramIndex = this.getParamsSize(); // Indexes are separate for readability reasons
        if (variable instanceof Param_1.Param) {
            const varId = `${this.globalPrefix.params}${variable.prefix}${paramIndex}`;
            return this.addParam(varId, variable);
        }
        const varIndex = this.references.size - paramIndex;
        const varId = `${this.globalPrefix.variables}${variable.prefix}${varIndex}`;
        this.references.set(variable, varId);
        return varId;
    }
    isNamedReference(ref) {
        return Boolean(ref.id);
    }
}
exports.CypherEnvironment = CypherEnvironment;
//# sourceMappingURL=Environment.js.map