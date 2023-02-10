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
exports.CypherReplanning = exports.CypherInterpretedPipesFallback = exports.CypherOperatorEngine = exports.CypherExpressionEngine = exports.CypherUpdateStrategy = exports.CypherConnectComponentsPlanner = exports.CypherPlanner = exports.CypherRuntime = exports.Node = void 0;
var classes_1 = require("./classes");
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return classes_1.Node; } });
var CypherRuntime;
(function (CypherRuntime) {
    CypherRuntime["INTERPRETED"] = "interpreted";
    CypherRuntime["SLOTTED"] = "slotted";
    CypherRuntime["PIPELINED"] = "pipelined";
})(CypherRuntime = exports.CypherRuntime || (exports.CypherRuntime = {}));
var CypherPlanner;
(function (CypherPlanner) {
    CypherPlanner["COST"] = "cost";
    CypherPlanner["IDP"] = "idp";
    CypherPlanner["DP"] = "dp";
})(CypherPlanner = exports.CypherPlanner || (exports.CypherPlanner = {}));
var CypherConnectComponentsPlanner;
(function (CypherConnectComponentsPlanner) {
    CypherConnectComponentsPlanner["GREEDY"] = "greedy";
    CypherConnectComponentsPlanner["IDP"] = "idp";
})(CypherConnectComponentsPlanner = exports.CypherConnectComponentsPlanner || (exports.CypherConnectComponentsPlanner = {}));
var CypherUpdateStrategy;
(function (CypherUpdateStrategy) {
    CypherUpdateStrategy["DEFAULT"] = "default";
    CypherUpdateStrategy["EAGER"] = "eager";
})(CypherUpdateStrategy = exports.CypherUpdateStrategy || (exports.CypherUpdateStrategy = {}));
var CypherExpressionEngine;
(function (CypherExpressionEngine) {
    CypherExpressionEngine["DEFAULT"] = "default";
    CypherExpressionEngine["INTERPRETED"] = "interpreted";
    CypherExpressionEngine["COMPILED"] = "compiled";
})(CypherExpressionEngine = exports.CypherExpressionEngine || (exports.CypherExpressionEngine = {}));
var CypherOperatorEngine;
(function (CypherOperatorEngine) {
    CypherOperatorEngine["DEFAULT"] = "default";
    CypherOperatorEngine["INTERPRETED"] = "interpreted";
    CypherOperatorEngine["COMPILED"] = "compiled";
})(CypherOperatorEngine = exports.CypherOperatorEngine || (exports.CypherOperatorEngine = {}));
var CypherInterpretedPipesFallback;
(function (CypherInterpretedPipesFallback) {
    CypherInterpretedPipesFallback["DEFAULT"] = "default";
    CypherInterpretedPipesFallback["DISABLED"] = "disabled";
    CypherInterpretedPipesFallback["WHITELISTED_PLANS_ONLY"] = "whitelisted_plans_only";
    CypherInterpretedPipesFallback["ALL"] = "all";
})(CypherInterpretedPipesFallback = exports.CypherInterpretedPipesFallback || (exports.CypherInterpretedPipesFallback = {}));
var CypherReplanning;
(function (CypherReplanning) {
    CypherReplanning["DEFAULT"] = "default";
    CypherReplanning["FORCE"] = "force";
    CypherReplanning["SKIP"] = "skip";
})(CypherReplanning = exports.CypherReplanning || (exports.CypherReplanning = {}));
//# sourceMappingURL=types.js.map