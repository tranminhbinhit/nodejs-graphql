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
exports.OptionalMatch = exports.Match = void 0;
const Pattern_1 = require("../Pattern");
const Clause_1 = require("./Clause");
const compile_cypher_if_exists_1 = require("../utils/compile-cypher-if-exists");
const WithReturn_1 = require("./mixins/WithReturn");
const mixin_1 = require("./utils/mixin");
const WithWhere_1 = require("./mixins/WithWhere");
const WithSet_1 = require("./mixins/WithSet");
const WithWith_1 = require("./mixins/WithWith");
const Delete_1 = require("./sub-clauses/Delete");
const Remove_1 = require("./sub-clauses/Remove");
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/match/)
 * @group Clauses
 */
let Match = class Match extends Clause_1.Clause {
    constructor(variable, parameters = {}) {
        super();
        this._optional = false;
        if (variable instanceof Pattern_1.Pattern) {
            this.pattern = variable;
        }
        else {
            this.pattern = new Pattern_1.Pattern(variable).withParams(parameters);
        }
    }
    /** Attach a DELETE subclause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/delete/)
     */
    delete(...deleteInput) {
        this.createDeleteClause(deleteInput);
        return this;
    }
    /** Attach a DETACH DELETE subclause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/delete/)
     */
    detachDelete(...deleteInput) {
        const deleteClause = this.createDeleteClause(deleteInput);
        deleteClause.detach();
        return this;
    }
    remove(...properties) {
        this.removeClause = new Remove_1.RemoveClause(this, properties);
        return this;
    }
    /** Makes the clause an OPTIONAL MATCH
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/)
     * @example
     * ```ts
     * new Cypher.Match(new Node({labels: ["Movie"]})).optional();
     * ```
     * _Cypher:_
     * ```cypher
     * OPTIONAL MATCH (this:Movie)
     * ```
     */
    optional() {
        this._optional = true;
        return this;
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const nodeCypher = this.pattern.getCypher(env);
        const whereCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.whereSubClause, env, { prefix: "\n" });
        const returnCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.returnStatement, env, { prefix: "\n" });
        const setCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.setSubClause, env, { prefix: "\n" });
        const withCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.withStatement, env, { prefix: "\n" });
        const deleteCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.deleteClause, env, { prefix: "\n" });
        const removeCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.removeClause, env, { prefix: "\n" });
        const optionalMatch = this._optional ? "OPTIONAL " : "";
        return `${optionalMatch}MATCH ${nodeCypher}${whereCypher}${setCypher}${removeCypher}${deleteCypher}${withCypher}${returnCypher}`;
    }
    createDeleteClause(deleteInput) {
        this.deleteClause = new Delete_1.DeleteClause(this, deleteInput);
        return this.deleteClause;
    }
};
Match = __decorate([
    (0, mixin_1.mixin)(WithReturn_1.WithReturn, WithWhere_1.WithWhere, WithSet_1.WithSet, WithWith_1.WithWith)
], Match);
exports.Match = Match;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/)
 * @group Clauses
 */
class OptionalMatch extends Match {
    constructor(variable, parameters = {}) {
        super(variable, parameters);
        this.optional();
    }
}
exports.OptionalMatch = OptionalMatch;
//# sourceMappingURL=Match.js.map