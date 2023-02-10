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
exports.Create = void 0;
const Pattern_1 = require("../Pattern");
const Set_1 = require("./sub-clauses/Set");
const Clause_1 = require("./Clause");
const compile_cypher_if_exists_1 = require("../utils/compile-cypher-if-exists");
const WithReturn_1 = require("./mixins/WithReturn");
const mixin_1 = require("./utils/mixin");
const WithSet_1 = require("./mixins/WithSet");
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/create/)
 * @group Clauses
 */
let Create = class Create extends Clause_1.Clause {
    constructor(node, params = {}) {
        super();
        this.pattern = new Pattern_1.Pattern(node).withParams(params);
        this.setSubClause = new Set_1.SetClause(this);
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const nodeCypher = this.pattern.getCypher(env);
        const setCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.setSubClause, env, { prefix: "\n" });
        const returnCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.returnStatement, env, { prefix: "\n" });
        return `CREATE ${nodeCypher}${setCypher}${returnCypher}`;
    }
};
Create = __decorate([
    (0, mixin_1.mixin)(WithReturn_1.WithReturn, WithSet_1.WithSet)
], Create);
exports.Create = Create;
//# sourceMappingURL=Create.js.map