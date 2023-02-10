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
exports.FullTextQueryNodes = void 0;
const Where_1 = require("../clauses/sub-clauses/Where");
const Clause_1 = require("../clauses/Clause");
const WithReturn_1 = require("../clauses/mixins/WithReturn");
const mixin_1 = require("../clauses/utils/mixin");
const compile_cypher_if_exists_1 = require("../utils/compile-cypher-if-exists");
// TODO: remove yield and CALL and put them in CallProcedure
/**
 * @group Procedures
 */
let FullTextQueryNodes = class FullTextQueryNodes extends Clause_1.Clause {
    constructor(targetNode, indexName, phrase, scoreVar, parent) {
        super(parent);
        this.targetNode = targetNode;
        this.indexName = indexName;
        this.phrase = phrase;
        this.scoreVar = scoreVar;
    }
    where(input) {
        if (!this.whereClause) {
            const whereStatement = new Where_1.Where(this, input);
            this.addChildren(whereStatement);
            this.whereClause = whereStatement;
        }
        else {
            this.whereClause.and(input);
        }
        return this;
    }
    getCypher(env) {
        const targetId = this.targetNode.getCypher(env);
        const scoreYield = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.scoreVar, env, { prefix: ", score AS " });
        const textSearchStr = `CALL db.index.fulltext.queryNodes("${this.indexName}", ${this.phrase.getCypher(env)}) YIELD node AS ${targetId}${scoreYield}`;
        const whereStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.whereClause, env, { prefix: "\n" });
        const returnStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.returnStatement, env, { prefix: "\n" });
        return `${textSearchStr}${whereStr}${returnStr}`;
    }
};
FullTextQueryNodes = __decorate([
    (0, mixin_1.mixin)(WithReturn_1.WithReturn)
], FullTextQueryNodes);
exports.FullTextQueryNodes = FullTextQueryNodes;
//# sourceMappingURL=db.js.map