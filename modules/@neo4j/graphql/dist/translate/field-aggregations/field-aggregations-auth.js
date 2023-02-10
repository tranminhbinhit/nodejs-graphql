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
exports.createFieldAggregationAuth = void 0;
const constants_1 = require("../../constants");
const create_auth_and_params_1 = require("../create-auth-and-params");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
function createFieldAggregationAuth({ node, context, subqueryNodeAlias, nodeFields, }) {
    const allowAuth = getAllowAuth({ node, context, varName: subqueryNodeAlias });
    const whereAuth = getWhereAuth({ node, context, varName: subqueryNodeAlias });
    const nodeAuth = getFieldAuth({ fields: nodeFields, node, context, varName: subqueryNodeAlias });
    const authPredicates = [];
    if (allowAuth)
        authPredicates.push(allowAuth);
    if (whereAuth)
        authPredicates.push(whereAuth);
    if (nodeAuth)
        authPredicates.push(nodeAuth);
    return cypher_builder_1.default.and(...authPredicates);
}
exports.createFieldAggregationAuth = createFieldAggregationAuth;
function getAllowAuth({ node, context, varName, }) {
    const allowAuth = (0, create_auth_and_params_1.createAuthPredicates)({
        entity: node,
        operations: "READ",
        context,
        allow: { parentNode: node, varName },
        escapeQuotes: false,
    });
    if (allowAuth)
        return new cypher_builder_1.default.apoc.ValidatePredicate(cypher_builder_1.default.not(allowAuth), constants_1.AUTH_FORBIDDEN_ERROR);
    return undefined;
}
function getWhereAuth({ node, context, varName, }) {
    const allowAuth = (0, create_auth_and_params_1.createAuthPredicates)({
        entity: node,
        operations: "READ",
        context,
        where: { varName, node },
    });
    if (allowAuth) {
        return allowAuth;
    }
    return undefined;
}
function getFieldAuth({ fields = {}, node, context, varName, }) {
    const authPredicates = [];
    Object.entries(fields).forEach((selection) => {
        const authField = node.authableFields.find((x) => x.fieldName === selection[0]);
        if (authField && authField.auth) {
            const allowAuth = (0, create_auth_and_params_1.createAuthPredicates)({
                entity: authField,
                operations: "READ",
                context,
                allow: { parentNode: node, varName },
                escapeQuotes: false,
            });
            if (allowAuth)
                authPredicates.push(allowAuth);
        }
    });
    if (authPredicates.length > 0) {
        return new cypher_builder_1.default.apoc.ValidatePredicate(cypher_builder_1.default.not(cypher_builder_1.default.and(...authPredicates)), constants_1.AUTH_FORBIDDEN_ERROR);
    }
    return undefined;
}
//# sourceMappingURL=field-aggregations-auth.js.map