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
exports.Union = void 0;
const Clause_1 = require("./Clause");
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/union/)
 * @group Clauses
 */
class Union extends Clause_1.Clause {
    constructor(...subqueries) {
        super();
        this.subqueries = [];
        this.includeAll = false;
        this.subqueries = subqueries.map((s) => s.getRoot());
        this.addChildren(...subqueries);
    }
    all() {
        this.includeAll = true;
        return this;
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const subqueriesStr = this.subqueries.map((s) => s.getCypher(env));
        const unionStr = this.includeAll ? "UNION ALL" : "UNION";
        return subqueriesStr.join(`\n${unionStr}\n`);
    }
}
exports.Union = Union;
//# sourceMappingURL=Union.js.map