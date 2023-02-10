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
var With_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.With = void 0;
const Projection_1 = require("./sub-clauses/Projection");
const compile_cypher_if_exists_1 = require("../utils/compile-cypher-if-exists");
const Clause_1 = require("./Clause");
const WithOrder_1 = require("./mixins/WithOrder");
const WithReturn_1 = require("./mixins/WithReturn");
const WithWhere_1 = require("./mixins/WithWhere");
const mixin_1 = require("./utils/mixin");
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/with/)
 * @group Clauses
 */
let With = With_1 = class With extends Clause_1.Clause {
    constructor(...columns) {
        super();
        this.isDistinct = false;
        this.projection = new Projection_1.Projection(columns);
    }
    addColumns(...columns) {
        this.projection.addColumns(columns);
        return this;
    }
    distinct() {
        this.isDistinct = true;
        return this;
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const projectionStr = this.projection.getCypher(env);
        const orderByStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.orderByStatement, env, { prefix: "\n" });
        const returnStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.returnStatement, env, { prefix: "\n" });
        const withStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.withStatement, env, { prefix: "\n" });
        const whereStr = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.whereSubClause, env, { prefix: "\n" });
        const distinctStr = this.isDistinct ? " DISTINCT" : "";
        return `WITH${distinctStr} ${projectionStr}${whereStr}${orderByStr}${withStr}${returnStr}`;
    }
    // Cannot be part of WithWith due to dependency cycles
    with(...columns) {
        if (this.withStatement) {
            this.withStatement.addColumns(...columns);
        }
        else {
            this.withStatement = new With_1(...columns);
            this.addChildren(this.withStatement);
        }
        return this.withStatement;
    }
};
With = With_1 = __decorate([
    (0, mixin_1.mixin)(WithOrder_1.WithOrder, WithReturn_1.WithReturn, WithWhere_1.WithWhere)
], With);
exports.With = With;
//# sourceMappingURL=With.js.map