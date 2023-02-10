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
exports.Unwind = void 0;
const Projection_1 = require("./sub-clauses/Projection");
const compile_cypher_if_exists_1 = require("../utils/compile-cypher-if-exists");
const Clause_1 = require("./Clause");
const WithWith_1 = require("./mixins/WithWith");
const mixin_1 = require("./utils/mixin");
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/unwind/)
 * @group Clauses
 */
let Unwind = class Unwind extends Clause_1.Clause {
    constructor(...columns) {
        super();
        this.projection = new Projection_1.Projection(columns);
    }
    addColumns(...columns) {
        this.projection.addColumns(columns);
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const projectionStr = this.projection.getCypher(env);
        const withCypher = (0, compile_cypher_if_exists_1.compileCypherIfExists)(this.withStatement, env, { prefix: "\n" });
        return `UNWIND ${projectionStr}${withCypher}`;
    }
};
Unwind = __decorate([
    (0, mixin_1.mixin)(WithWith_1.WithWith)
], Unwind);
exports.Unwind = Unwind;
//# sourceMappingURL=Unwind.js.map