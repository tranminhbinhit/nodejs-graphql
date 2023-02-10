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
exports.RunFirstColumn = void 0;
const CypherASTNode_1 = require("../../CypherASTNode");
/**
 * @group Expressions
 * @category Cypher Functions
 */
class RunFirstColumn extends CypherASTNode_1.CypherASTNode {
    constructor(clause, variables = [], expectMultipleValues = true) {
        super();
        this.innerClause = clause;
        this.expectMultipleValues = expectMultipleValues;
        this.variables = variables;
    }
    getCypher(env) {
        let clauseStr;
        let paramsStr;
        if (typeof this.innerClause === "string") {
            clauseStr = this.innerClause;
        }
        else {
            clauseStr = this.innerClause.getRoot().getCypher(env);
        }
        if (Array.isArray(this.variables)) {
            paramsStr = this.convertArrayToParams(env, this.variables);
        }
        else {
            paramsStr = this.variables.getCypher(env);
        }
        if (this.expectMultipleValues) {
            return `apoc.cypher.runFirstColumnMany("${this.escapeQuery(clauseStr)}", ${paramsStr})`;
        }
        return `apoc.cypher.runFirstColumnSingle("${this.escapeQuery(clauseStr)}", ${paramsStr})`;
    }
    escapeQuery(query) {
        // TODO: Should single quotes be escaped?
        // return query.replace(/("|')/g, "\\$1");
        return query.replace(/("|\\)/g, "\\$1");
    }
    convertArrayToParams(env, variables) {
        const params = variables.reduce((acc, variable) => {
            const globalScopeName = variable.getCypher(env);
            const key = env.getReferenceId(variable);
            acc[key] = globalScopeName;
            return acc;
        }, {});
        const paramsStr = Object.entries(params)
            .map(([key, value]) => {
            return `${key}: ${value}`;
        })
            .join(", ");
        return `{ ${paramsStr} }`;
    }
}
exports.RunFirstColumn = RunFirstColumn;
//# sourceMappingURL=RunFirstColumn.js.map