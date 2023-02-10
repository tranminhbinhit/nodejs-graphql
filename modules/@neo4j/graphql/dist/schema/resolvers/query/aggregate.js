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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateResolver = void 0;
const utils_1 = require("../../../utils");
const translate_1 = require("../../../translate");
const get_neo4j_resolve_tree_1 = __importDefault(require("../../../utils/get-neo4j-resolve-tree"));
const fulltext_1 = require("../../../schema/augment/fulltext");
function aggregateResolver({ node }) {
    async function resolve(_root, _args, _context, info) {
        const context = _context;
        context.resolveTree = (0, get_neo4j_resolve_tree_1.default)(info);
        const [cypher, params] = (0, translate_1.translateAggregate)({
            context,
            node,
        });
        const executeResult = await (0, utils_1.execute)({
            cypher,
            params,
            defaultAccessMode: "READ",
            context,
        });
        return Object.values(executeResult.records[0] || {})[0];
    }
    return {
        type: `${node.aggregateTypeNames.selection}!`,
        resolve,
        args: {
            where: `${node.name}Where`,
            ...(node.fulltextDirective
                ? {
                    fulltext: {
                        type: `${node.name}Fulltext`,
                        directives: [
                            {
                                name: "deprecated",
                                args: {
                                    reason: fulltext_1.fulltextArgDeprecationMessage,
                                },
                            },
                        ],
                    },
                }
                : {}),
        },
    };
}
exports.aggregateResolver = aggregateResolver;
//# sourceMappingURL=aggregate.js.map