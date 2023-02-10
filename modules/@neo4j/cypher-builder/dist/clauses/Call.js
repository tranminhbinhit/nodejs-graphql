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
exports.Call = void 0;
const Clause_1 = require("./Clause");
const pad_block_1 = require("../utils/pad-block");
const ImportWith_1 = require("./sub-clauses/ImportWith");
const WithReturn_1 = require("./mixins/WithReturn");
const mixin_1 = require("./utils/mixin");
const WithWith_1 = require("./mixins/WithWith");
const compile_cypher_if_exists_1 = require("../utils/compile-cypher-if-exists");
const WithUnwind_1 = require("./mixins/WithUnwind");
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/call-subquery/)
 * @group Clauses
 */
let Call = class Call extends Clause_1.Clause {
    constructor(subQuery) {
        super();
        const rootQuery = subQuery.getRoot();
        this.addChildren(rootQuery);
        this.subQuery = rootQuery;
    }
    innerWith(...params) {
        if (this.importWith)
            throw new Error("Call import already set");
        this.importWith = new ImportWith_1.ImportWith(this, params);
        this.addChildren(this.importWith);
        return this;
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const subQueryStr = this.subQuery.getCypher(env);
        const innerWithCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.importWith, env, { suffix: "\n" });
        const returnCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.returnStatement, env, { prefix: "\n" });
        const withCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.withStatement, env, { prefix: "\n" });
        const unwindCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.unwindStatement, env, { prefix: "\n" });
        const inCallBlock = `${innerWithCypher}${subQueryStr}`;
        return `CALL {\n${(0, pad_block_1.padBlock)(inCallBlock)}\n}${withCypher}${unwindCypher}${returnCypher}`;
    }
};
Call = __decorate([
    (0, mixin_1.mixin)(WithReturn_1.WithReturn, WithWith_1.WithWith, WithUnwind_1.WithUnwind)
], Call);
exports.Call = Call;
//# sourceMappingURL=Call.js.map