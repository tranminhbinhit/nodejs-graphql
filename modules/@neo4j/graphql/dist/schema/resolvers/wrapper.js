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
exports.wrapSubscription = exports.wrapResolver = void 0;
const debug_1 = __importDefault(require("debug"));
const graphql_1 = require("graphql");
const Neo4jDatabaseInfo_1 = require("../../classes/Neo4jDatabaseInfo");
const Executor_1 = require("../../classes/Executor");
const constants_1 = require("../../constants");
const create_auth_param_1 = __importDefault(require("../../translate/create-auth-param"));
const get_token_1 = require("../../utils/get-token");
const wrapper_utils_1 = require("./wrapper-utils");
const http_1 = require("http");
const debug = (0, debug_1.default)(constants_1.DEBUG_GRAPHQL);
let neo4jDatabaseInfo;
const wrapResolver = ({ driver, config, nodes, relationships, schemaModel, plugins, dbInfo }) => (next) => async (root, args, context, info) => {
    const { driverConfig } = config;
    if (debug.enabled) {
        const query = (0, graphql_1.print)(info.operation);
        debug("%s", `Incoming GraphQL:\nQuery:\n${query}\nVariables:\n${JSON.stringify(info.variableValues, null, 2)}`);
    }
    if (!context?.executionContext) {
        if (context?.driver) {
            context.executionContext = context.driver;
        }
        else {
            if (!driver) {
                throw new Error("A Neo4j driver instance must either be passed to Neo4jGraphQL on construction, or a driver, session or transaction passed as context.executionContext in each request.");
            }
            context.executionContext = driver;
        }
    }
    if (!context?.driverConfig) {
        context.driverConfig = driverConfig;
    }
    context.nodes = nodes;
    context.relationships = relationships;
    context.schemaModel = schemaModel;
    context.plugins = plugins || {};
    context.subscriptionsEnabled = Boolean(context.plugins?.subscriptions);
    context.callbacks = config.callbacks;
    if (!context.jwt) {
        if (context.plugins.auth) {
            // Here we will try to compute the generic Secret or the generic jwksEndpoint
            const contextRequest = context.req || context.request;
            context.plugins.auth.tryToResolveKeys(context instanceof http_1.IncomingMessage ? context : contextRequest);
        }
        const token = (0, get_token_1.getToken)(context);
        context.jwt = await (0, wrapper_utils_1.decodeToken)(token, context.plugins.auth);
    }
    (0, wrapper_utils_1.verifyGlobalAuthentication)(context, context.plugins?.auth);
    context.auth = (0, create_auth_param_1.default)({ context });
    const executorConstructorParam = {
        executionContext: context.executionContext,
        auth: context.auth,
    };
    if (config.queryOptions) {
        executorConstructorParam.queryOptions = config.queryOptions;
    }
    if (context.driverConfig?.database) {
        executorConstructorParam.database = context.driverConfig?.database;
    }
    if (context.driverConfig?.bookmarks) {
        executorConstructorParam.bookmarks = context.driverConfig?.bookmarks;
    }
    context.executor = new Executor_1.Executor(executorConstructorParam);
    if (!context.neo4jDatabaseInfo?.version) {
        if (dbInfo) {
            neo4jDatabaseInfo = dbInfo;
        }
        if (!neo4jDatabaseInfo?.version) {
            neo4jDatabaseInfo = await (0, Neo4jDatabaseInfo_1.getNeo4jDatabaseInfo)(context.executor);
        }
        context.neo4jDatabaseInfo = neo4jDatabaseInfo;
    }
    return next(root, args, context, info);
};
exports.wrapResolver = wrapResolver;
const wrapSubscription = (resolverArgs) => (next) => async (root, args, context, info) => {
    const plugins = resolverArgs?.plugins || {};
    const contextParams = context?.connectionParams || {};
    if (!plugins.subscriptions) {
        debug("Subscription Plugin not set");
        return next(root, args, context, info);
    }
    const subscriptionContext = {
        plugin: plugins.subscriptions,
    };
    if (!context?.jwt && contextParams.authorization) {
        const token = (0, get_token_1.parseBearerToken)(contextParams.authorization);
        subscriptionContext.jwt = await (0, wrapper_utils_1.decodeToken)(token, plugins.auth);
    }
    (0, wrapper_utils_1.verifyGlobalAuthentication)(subscriptionContext, plugins.auth);
    return next(root, args, { ...context, ...contextParams, ...subscriptionContext }, info);
};
exports.wrapSubscription = wrapSubscription;
//# sourceMappingURL=wrapper.js.map