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
exports.createResolver = void 0;
const utils_1 = require("../../../utils");
const translate_1 = require("../../../translate");
const get_neo4j_resolve_tree_1 = __importDefault(require("../../../utils/get-neo4j-resolve-tree"));
const publish_events_to_plugin_1 = require("../../subscriptions/publish-events-to-plugin");
function createResolver({ node }) {
    async function resolve(_root, args, _context, info) {
        const context = _context;
        context.resolveTree = (0, get_neo4j_resolve_tree_1.default)(info, { args });
        const { cypher, params } = await (0, translate_1.translateCreate)({ context, node });
        const executeResult = await (0, utils_1.execute)({
            cypher,
            params,
            defaultAccessMode: "WRITE",
            context,
        });
        const nodeProjection = info.fieldNodes[0].selectionSet?.selections.find((selection) => selection.kind === "Field" && selection.name.value === node.plural);
        const nodeKey = nodeProjection?.alias ? nodeProjection.alias.value : nodeProjection?.name?.value;
        (0, publish_events_to_plugin_1.publishEventsToPlugin)(executeResult, context.plugins?.subscriptions, context.schemaModel);
        return {
            info: {
                bookmark: executeResult.bookmark,
                ...executeResult.statistics,
            },
            ...(nodeProjection ? { [nodeKey]: executeResult.records[0]?.data || [] } : {}),
        };
    }
    return {
        type: `${node.mutationResponseTypeNames.create}!`,
        resolve,
        args: { input: `[${node.name}CreateInput!]!` },
    };
}
exports.createResolver = createResolver;
//# sourceMappingURL=create.js.map