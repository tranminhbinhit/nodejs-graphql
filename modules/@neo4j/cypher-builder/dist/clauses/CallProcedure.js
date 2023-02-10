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
exports.CallProcedure = void 0;
const Clause_1 = require("./Clause");
// TODO: ADD yield, where and return
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/call/)
 * @group Clauses
 */
class CallProcedure extends Clause_1.Clause {
    constructor(procedure) {
        super();
        this.procedure = procedure;
    }
    /**
     * @hidden
     */
    getCypher(env) {
        const procedureCypher = this.procedure.getCypher(env);
        return `CALL ${procedureCypher}`;
    }
}
exports.CallProcedure = CallProcedure;
//# sourceMappingURL=CallProcedure.js.map