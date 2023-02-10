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
exports.Pattern = void 0;
const stringify_object_1 = require("./utils/stringify-object");
const escape_label_1 = require("./utils/escape-label");
const pad_left_1 = require("./utils/pad-left");
/** Represents a MATCH pattern
 * @group Other
 */
class Pattern {
    constructor(input, options) {
        this.reversed = false;
        this.matchElement = input;
        this.parameters = {};
        const sourceOptions = {
            labels: true,
            variable: true,
            ...(options?.source || {}),
        };
        const targetOptions = {
            labels: true,
            variable: true,
            ...(options?.target || {}),
        };
        const relationshipOption = {
            type: true,
            variable: true,
            ...(options?.relationship || {}),
        };
        this.options = {
            source: sourceOptions,
            target: targetOptions,
            relationship: relationshipOption,
            directed: options?.directed,
        };
    }
    withParams(parameters) {
        this.parameters = parameters;
        return this;
    }
    /**
     * @hidden
     */
    getCypher(env) {
        if (this.isRelationship(this.matchElement)) {
            return this.getRelationshipCypher(env, this.matchElement);
        }
        return this.getNodeCypher(env, this.matchElement, this.parameters);
    }
    /** Reverses the pattern direction, not the underlying relationship */
    reverse() {
        if (!this.isRelationshipPattern())
            throw new Error("Cannot reverse a node pattern");
        this.reversed = true;
    }
    isRelationshipPattern() {
        return this.matchElement.source;
    }
    getRelationshipCypher(env, relationship) {
        const referenceId = this.options?.relationship?.variable ? env.getReferenceId(relationship) : "";
        const parameterOptions = this.parameters;
        const relationshipParamsStr = this.serializeParameters(parameterOptions.relationship || {}, env);
        const relationshipType = this.options.relationship?.type ? this.getRelationshipTypesString(relationship) : "";
        const sourceStr = this.getNodeCypher(env, relationship.source, parameterOptions.source, "source");
        const targetStr = this.getNodeCypher(env, relationship.target, parameterOptions.target, "target");
        const arrowStrs = this.getRelationshipArrows();
        const relationshipStr = `${referenceId}${relationshipType}${relationshipParamsStr}`;
        return `${sourceStr}${arrowStrs[0]}[${relationshipStr}]${arrowStrs[1]}${targetStr}`;
    }
    getRelationshipArrows() {
        if (this.options.directed === false)
            return ["-", "-"];
        if (this.reversed)
            return ["<-", "-"];
        return ["-", "->"];
    }
    // Note: This allows us to remove cycle dependency between pattern and relationship
    isRelationship(x) {
        return Boolean(x.source);
    }
    getNodeCypher(env, node, parameters, item = "source") {
        const nodeOptions = this.options[item];
        const referenceId = nodeOptions.variable ? env.getReferenceId(node) : "";
        const parametersStr = this.serializeParameters(parameters || {}, env);
        const nodeLabelString = nodeOptions.labels ? this.getNodeLabelsString(node) : "";
        return `(${referenceId}${nodeLabelString}${parametersStr})`;
    }
    serializeParameters(parameters, env) {
        if (Object.keys(parameters).length === 0)
            return "";
        const paramValues = Object.entries(parameters).reduce((acc, [key, param]) => {
            acc[key] = param.getCypher(env);
            return acc;
        }, {});
        return (0, pad_left_1.padLeft)((0, stringify_object_1.stringifyObject)(paramValues));
    }
    getNodeLabelsString(node) {
        const escapedLabels = node.labels.map(escape_label_1.escapeLabel);
        if (escapedLabels.length === 0)
            return "";
        return `:${escapedLabels.join(":")}`;
    }
    getRelationshipTypesString(relationship) {
        // TODO: escapeLabel
        return relationship.type ? `:${relationship.type}` : "";
    }
}
exports.Pattern = Pattern;
//# sourceMappingURL=Pattern.js.map