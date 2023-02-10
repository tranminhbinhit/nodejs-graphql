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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coalesce = exports.Function = exports.minus = exports.plus = exports.matches = exports.endsWith = exports.startsWith = exports.contains = exports.in = exports.isNotNull = exports.isNull = exports.lte = exports.lt = exports.gte = exports.gt = exports.eq = exports.not = exports.and = exports.or = exports.MapProjection = exports.Map = exports.List = exports.PatternComprehension = exports.ListComprehension = exports.apoc = exports.db = exports.Case = exports.Exists = exports.Null = exports.Literal = exports.Variable = exports.NamedVariable = exports.NamedParam = exports.Param = exports.Relationship = exports.NamedNode = exports.Node = exports.concat = exports.Foreach = exports.Union = exports.Unwind = exports.With = exports.RawCypher = exports.Return = exports.CallProcedure = exports.Call = exports.Merge = exports.Create = exports.OptionalMatch = exports.Match = void 0;
exports.utils = exports.single = exports.exists = exports.all = exports.any = exports.randomUUID = exports.sum = exports.avg = exports.max = exports.min = exports.count = exports.labels = exports.time = exports.localdatetime = exports.localtime = exports.date = exports.datetime = exports.pointDistance = exports.distance = exports.point = void 0;
// Clauses
var Match_1 = require("./clauses/Match");
Object.defineProperty(exports, "Match", { enumerable: true, get: function () { return Match_1.Match; } });
Object.defineProperty(exports, "OptionalMatch", { enumerable: true, get: function () { return Match_1.OptionalMatch; } });
var Create_1 = require("./clauses/Create");
Object.defineProperty(exports, "Create", { enumerable: true, get: function () { return Create_1.Create; } });
var Merge_1 = require("./clauses/Merge");
Object.defineProperty(exports, "Merge", { enumerable: true, get: function () { return Merge_1.Merge; } });
var Call_1 = require("./clauses/Call");
Object.defineProperty(exports, "Call", { enumerable: true, get: function () { return Call_1.Call; } });
var CallProcedure_1 = require("./clauses/CallProcedure");
Object.defineProperty(exports, "CallProcedure", { enumerable: true, get: function () { return CallProcedure_1.CallProcedure; } });
var Return_1 = require("./clauses/Return");
Object.defineProperty(exports, "Return", { enumerable: true, get: function () { return Return_1.Return; } });
var RawCypher_1 = require("./clauses/RawCypher");
Object.defineProperty(exports, "RawCypher", { enumerable: true, get: function () { return RawCypher_1.RawCypher; } });
var With_1 = require("./clauses/With");
Object.defineProperty(exports, "With", { enumerable: true, get: function () { return With_1.With; } });
var Unwind_1 = require("./clauses/Unwind");
Object.defineProperty(exports, "Unwind", { enumerable: true, get: function () { return Unwind_1.Unwind; } });
var Union_1 = require("./clauses/Union");
Object.defineProperty(exports, "Union", { enumerable: true, get: function () { return Union_1.Union; } });
var Foreach_1 = require("./clauses/Foreach");
Object.defineProperty(exports, "Foreach", { enumerable: true, get: function () { return Foreach_1.Foreach; } });
var concat_1 = require("./clauses/utils/concat");
Object.defineProperty(exports, "concat", { enumerable: true, get: function () { return concat_1.concat; } });
// Variables and references
var NodeRef_1 = require("./references/NodeRef");
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return NodeRef_1.NodeRef; } });
Object.defineProperty(exports, "NamedNode", { enumerable: true, get: function () { return NodeRef_1.NamedNode; } });
var RelationshipRef_1 = require("./references/RelationshipRef");
Object.defineProperty(exports, "Relationship", { enumerable: true, get: function () { return RelationshipRef_1.RelationshipRef; } });
var Param_1 = require("./references/Param");
Object.defineProperty(exports, "Param", { enumerable: true, get: function () { return Param_1.Param; } });
Object.defineProperty(exports, "NamedParam", { enumerable: true, get: function () { return Param_1.NamedParam; } });
var Variable_1 = require("./references/Variable");
Object.defineProperty(exports, "NamedVariable", { enumerable: true, get: function () { return Variable_1.NamedVariable; } });
Object.defineProperty(exports, "Variable", { enumerable: true, get: function () { return Variable_1.Variable; } });
var Literal_1 = require("./references/Literal");
Object.defineProperty(exports, "Literal", { enumerable: true, get: function () { return Literal_1.Literal; } });
Object.defineProperty(exports, "Null", { enumerable: true, get: function () { return Literal_1.CypherNull; } });
// Expressions
var Exists_1 = require("./expressions/Exists");
Object.defineProperty(exports, "Exists", { enumerable: true, get: function () { return Exists_1.Exists; } });
var Case_1 = require("./expressions/Case");
Object.defineProperty(exports, "Case", { enumerable: true, get: function () { return Case_1.Case; } });
// --Procedures
exports.db = __importStar(require("./procedures/db"));
// --Apoc
exports.apoc = __importStar(require("./apoc/apoc"));
// --Lists
var ListComprehension_1 = require("./expressions/list/ListComprehension");
Object.defineProperty(exports, "ListComprehension", { enumerable: true, get: function () { return ListComprehension_1.ListComprehension; } });
var PatternComprehension_1 = require("./expressions/list/PatternComprehension");
Object.defineProperty(exports, "PatternComprehension", { enumerable: true, get: function () { return PatternComprehension_1.PatternComprehension; } });
var ListExpr_1 = require("./expressions/list/ListExpr");
Object.defineProperty(exports, "List", { enumerable: true, get: function () { return ListExpr_1.ListExpr; } });
// --Map
var MapExpr_1 = require("./expressions/map/MapExpr");
Object.defineProperty(exports, "Map", { enumerable: true, get: function () { return MapExpr_1.MapExpr; } });
var MapProjection_1 = require("./expressions/map/MapProjection");
Object.defineProperty(exports, "MapProjection", { enumerable: true, get: function () { return MapProjection_1.MapProjection; } });
// --Operations
var boolean_1 = require("./expressions/operations/boolean");
Object.defineProperty(exports, "or", { enumerable: true, get: function () { return boolean_1.or; } });
Object.defineProperty(exports, "and", { enumerable: true, get: function () { return boolean_1.and; } });
Object.defineProperty(exports, "not", { enumerable: true, get: function () { return boolean_1.not; } });
var comparison_1 = require("./expressions/operations/comparison");
Object.defineProperty(exports, "eq", { enumerable: true, get: function () { return comparison_1.eq; } });
Object.defineProperty(exports, "gt", { enumerable: true, get: function () { return comparison_1.gt; } });
Object.defineProperty(exports, "gte", { enumerable: true, get: function () { return comparison_1.gte; } });
Object.defineProperty(exports, "lt", { enumerable: true, get: function () { return comparison_1.lt; } });
Object.defineProperty(exports, "lte", { enumerable: true, get: function () { return comparison_1.lte; } });
Object.defineProperty(exports, "isNull", { enumerable: true, get: function () { return comparison_1.isNull; } });
Object.defineProperty(exports, "isNotNull", { enumerable: true, get: function () { return comparison_1.isNotNull; } });
Object.defineProperty(exports, "in", { enumerable: true, get: function () { return comparison_1.inOp; } });
Object.defineProperty(exports, "contains", { enumerable: true, get: function () { return comparison_1.contains; } });
Object.defineProperty(exports, "startsWith", { enumerable: true, get: function () { return comparison_1.startsWith; } });
Object.defineProperty(exports, "endsWith", { enumerable: true, get: function () { return comparison_1.endsWith; } });
Object.defineProperty(exports, "matches", { enumerable: true, get: function () { return comparison_1.matches; } });
var math_1 = require("./expressions/operations/math");
Object.defineProperty(exports, "plus", { enumerable: true, get: function () { return math_1.plus; } });
Object.defineProperty(exports, "minus", { enumerable: true, get: function () { return math_1.minus; } });
// --Functions
var CypherFunction_1 = require("./expressions/functions/CypherFunction");
Object.defineProperty(exports, "Function", { enumerable: true, get: function () { return CypherFunction_1.CypherFunction; } });
var CypherFunction_2 = require("./expressions/functions/CypherFunction");
Object.defineProperty(exports, "coalesce", { enumerable: true, get: function () { return CypherFunction_2.coalesce; } });
Object.defineProperty(exports, "point", { enumerable: true, get: function () { return CypherFunction_2.point; } });
Object.defineProperty(exports, "distance", { enumerable: true, get: function () { return CypherFunction_2.distance; } });
Object.defineProperty(exports, "pointDistance", { enumerable: true, get: function () { return CypherFunction_2.pointDistance; } });
Object.defineProperty(exports, "datetime", { enumerable: true, get: function () { return CypherFunction_2.cypherDatetime; } });
Object.defineProperty(exports, "date", { enumerable: true, get: function () { return CypherFunction_2.cypherDate; } });
Object.defineProperty(exports, "localtime", { enumerable: true, get: function () { return CypherFunction_2.cypherLocalTime; } });
Object.defineProperty(exports, "localdatetime", { enumerable: true, get: function () { return CypherFunction_2.cypherLocalDatetime; } });
Object.defineProperty(exports, "time", { enumerable: true, get: function () { return CypherFunction_2.cypherTime; } });
Object.defineProperty(exports, "labels", { enumerable: true, get: function () { return CypherFunction_2.labels; } });
Object.defineProperty(exports, "count", { enumerable: true, get: function () { return CypherFunction_2.count; } });
Object.defineProperty(exports, "min", { enumerable: true, get: function () { return CypherFunction_2.min; } });
Object.defineProperty(exports, "max", { enumerable: true, get: function () { return CypherFunction_2.max; } });
Object.defineProperty(exports, "avg", { enumerable: true, get: function () { return CypherFunction_2.avg; } });
Object.defineProperty(exports, "sum", { enumerable: true, get: function () { return CypherFunction_2.sum; } });
Object.defineProperty(exports, "randomUUID", { enumerable: true, get: function () { return CypherFunction_2.randomUUID; } });
__exportStar(require("./expressions/functions/StringFunctions"), exports);
__exportStar(require("./expressions/functions/ListFunctions"), exports);
var PredicateFunctions_1 = require("./expressions/functions/PredicateFunctions");
Object.defineProperty(exports, "any", { enumerable: true, get: function () { return PredicateFunctions_1.any; } });
Object.defineProperty(exports, "all", { enumerable: true, get: function () { return PredicateFunctions_1.all; } });
Object.defineProperty(exports, "exists", { enumerable: true, get: function () { return PredicateFunctions_1.exists; } });
Object.defineProperty(exports, "single", { enumerable: true, get: function () { return PredicateFunctions_1.single; } });
// utils
// --Procedures
exports.utils = __importStar(require("./utils/utils"));
//# sourceMappingURL=Cypher.js.map