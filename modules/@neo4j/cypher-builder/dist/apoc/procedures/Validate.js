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
exports.Validate = void 0;
const Literal_1 = require("../../references/Literal");
const CypherASTNode_1 = require("../../CypherASTNode");
/**
 * @group Procedures
 */
class Validate extends CypherASTNode_1.CypherASTNode {
    constructor(predicate, message, params = new Literal_1.Literal([0])) {
        super();
        this.predicate = predicate;
        this.message = message;
        this.params = params;
    }
    /**
     * @ignore
     */
    getCypher(env) {
        const predicateCypher = this.predicate.getCypher(env);
        const paramsCypher = this.params.getCypher(env);
        return `apoc.util.validate(${predicateCypher}, "${this.message}", ${paramsCypher})`;
    }
}
exports.Validate = Validate;
//# sourceMappingURL=Validate.js.map