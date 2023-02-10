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
exports.WithWhere = void 0;
const ClauseMixin_1 = require("./ClauseMixin");
const Where_1 = require("../sub-clauses/Where");
const boolean_1 = require("../../expressions/operations/boolean");
const PropertyRef_1 = require("../../references/PropertyRef");
const comparison_1 = require("../../expressions/operations/comparison");
const Reference_1 = require("../../references/Reference");
class WithWhere extends ClauseMixin_1.ClauseMixin {
    where(input, params) {
        this.updateOrCreateWhereClause(input, params);
        return this;
    }
    and(input, params) {
        this.updateOrCreateWhereClause(input, params);
        return this;
    }
    updateOrCreateWhereClause(input, params) {
        const whereInput = this.createWhereInput(input, params);
        if (!whereInput)
            return;
        if (!this.whereSubClause) {
            const whereClause = new Where_1.Where(this, whereInput);
            this.whereSubClause = whereClause;
        }
        else {
            this.whereSubClause.and(whereInput);
        }
    }
    createWhereInput(input, params) {
        if (input instanceof Reference_1.Reference || input instanceof PropertyRef_1.PropertyRef) {
            const generatedOp = this.variableAndObjectToOperation(input, params || {});
            return generatedOp;
        }
        return input;
    }
    /** Transforms a simple input into an operation sub tree */
    variableAndObjectToOperation(target, params) {
        let operation;
        for (const [key, value] of Object.entries(params)) {
            const property = target.property(key);
            const eqOp = (0, comparison_1.eq)(property, value);
            if (!operation)
                operation = eqOp;
            else {
                operation = (0, boolean_1.and)(operation, eqOp);
            }
        }
        return operation;
    }
}
exports.WithWhere = WithWhere;
//# sourceMappingURL=WithWhere.js.map