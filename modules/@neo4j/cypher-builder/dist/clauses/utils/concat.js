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
exports.concat = exports.CompositeClause = void 0;
const filter_truthy_1 = require("../../utils/filter-truthy");
const Clause_1 = require("../Clause");
/** The result of multiple clauses concatenated with {@link concat}
 * @group Clauses
 */
class CompositeClause extends Clause_1.Clause {
    /**
     * @hidden
     */
    constructor(children, separator) {
        super();
        this.separator = separator;
        this.children = [];
        this.concat(...children);
    }
    concat(...clauses) {
        const childrenRoots = (0, filter_truthy_1.filterTruthy)(clauses).map((c) => c.getRoot());
        this.addChildren(...childrenRoots);
        this.children = [...this.children, ...childrenRoots];
        return this;
    }
    get empty() {
        return this.children.length === 0;
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const childrenStrs = this.children.map((c) => c.getCypher(env));
        return childrenStrs.join(this.separator);
    }
}
exports.CompositeClause = CompositeClause;
/** Concatenates multiple {@link Clause | clauses} into a single clause
 * @group Clauses
 */
function concat(...clauses) {
    return new CompositeClause(clauses, "\n");
}
exports.concat = concat;
//# sourceMappingURL=concat.js.map