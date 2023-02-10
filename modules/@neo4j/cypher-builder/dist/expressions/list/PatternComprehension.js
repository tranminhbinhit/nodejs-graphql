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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternComprehension = void 0;
const WithWhere_1 = require("../../clauses/mixins/WithWhere");
const mixin_1 = require("../../clauses/utils/mixin");
const CypherASTNode_1 = require("../../CypherASTNode");
const Pattern_1 = require("../../Pattern");
const compile_cypher_if_exists_1 = require("../../utils/compile-cypher-if-exists");
/** Represents a Pattern comprehension
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/lists/#cypher-pattern-comprehension)
 * @group Expressions
 */
let PatternComprehension = class PatternComprehension extends CypherASTNode_1.CypherASTNode {
    constructor(pattern, mapExpr) {
        super();
        if (pattern instanceof Pattern_1.Pattern) {
            this.pattern = pattern;
        }
        else {
            this.pattern = new Pattern_1.Pattern(pattern);
        }
        this.mapExpr = mapExpr;
    }
    getCypher(env) {
        const whereStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.whereSubClause, env, { prefix: " " });
        const mapStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.mapExpr, env, { prefix: " | " });
        const patternStr = this.pattern.getCypher(env);
        return `[${patternStr}${whereStr}${mapStr}]`;
    }
};
PatternComprehension = __decorate([
    (0, mixin_1.mixin)(WithWhere_1.WithWhere)
], PatternComprehension);
exports.PatternComprehension = PatternComprehension;
//# sourceMappingURL=PatternComprehension.js.map