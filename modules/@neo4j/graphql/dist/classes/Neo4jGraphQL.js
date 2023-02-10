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
const schema_1 = require("@graphql-tools/schema");
const resolvers_composition_1 = require("@graphql-tools/resolvers-composition");
const utils_1 = require("@graphql-tools/utils");
const merge_1 = require("@graphql-tools/merge");
const debug_1 = __importDefault(require("debug"));
const schema_2 = require("../schema");
const verify_database_1 = __importDefault(require("./utils/verify-database"));
const asserts_indexes_and_constraints_1 = __importDefault(require("./utils/asserts-indexes-and-constraints"));
const wrapper_1 = require("../schema/resolvers/wrapper");
const defaultField_1 = require("../schema/resolvers/field/defaultField");
const utils_2 = require("../utils/utils");
const constants_1 = require("../constants");
const Neo4jDatabaseInfo_1 = require("./Neo4jDatabaseInfo");
const Executor_1 = require("./Executor");
const get_document_1 = require("../schema/get-document");
const generate_model_1 = require("../schema-model/generate-model");
class Neo4jGraphQL {
    constructor(input) {
        const { config = {}, driver, plugins, features, ...schemaDefinition } = input;
        this.driver = driver;
        this.config = config;
        this.plugins = plugins;
        this.features = features;
        this.schemaDefinition = schemaDefinition;
        this.checkEnableDebug();
    }
    get nodes() {
        if (!this._nodes) {
            throw new Error("You must await `.getSchema()` before accessing `nodes`");
        }
        return this._nodes;
    }
    get relationships() {
        if (!this._relationships) {
            throw new Error("You must await `.getSchema()` before accessing `relationships`");
        }
        return this._relationships;
    }
    async getSchema() {
        if (!this.schema) {
            this.schema = this.generateSchema();
            await this.pluginsSetup();
        }
        return this.schema;
    }
    async checkNeo4jCompat(input = {}) {
        const driver = input.driver || this.driver;
        const driverConfig = input.driverConfig || this.config?.driverConfig;
        if (!driver) {
            throw new Error("neo4j-driver Driver missing");
        }
        if (!this.dbInfo) {
            this.dbInfo = await this.getNeo4jDatabaseInfo(driver, driverConfig);
        }
        return (0, verify_database_1.default)({ driver, driverConfig, dbInfo: this.dbInfo });
    }
    async assertIndexesAndConstraints(input = {}) {
        if (!this.schema) {
            throw new Error("You must call `.getSchema()` before `.assertIndexesAndConstraints()`");
        }
        await this.schema;
        const driver = input.driver || this.driver;
        const driverConfig = input.driverConfig || this.config?.driverConfig;
        if (!driver) {
            throw new Error("neo4j-driver Driver missing");
        }
        if (!this.dbInfo) {
            this.dbInfo = await this.getNeo4jDatabaseInfo(driver, driverConfig);
        }
        await (0, asserts_indexes_and_constraints_1.default)({
            driver,
            driverConfig,
            nodes: this.nodes,
            options: input.options,
            dbInfo: this.dbInfo,
        });
    }
    addDefaultFieldResolvers(schema) {
        (0, utils_1.forEachField)(schema, (field) => {
            if (!field.resolve) {
                field.resolve = defaultField_1.defaultFieldResolver;
            }
        });
        return schema;
    }
    checkEnableDebug() {
        if (this.config.enableDebug === true || this.config.enableDebug === false) {
            if (this.config.enableDebug) {
                debug_1.default.enable(constants_1.DEBUG_ALL);
            }
            else {
                debug_1.default.disable();
            }
        }
    }
    async getNeo4jDatabaseInfo(driver, driverConfig) {
        const executorConstructorParam = {
            executionContext: driver,
        };
        if (driverConfig?.database) {
            executorConstructorParam.database = driverConfig?.database;
        }
        if (driverConfig?.bookmarks) {
            executorConstructorParam.bookmarks = driverConfig?.bookmarks;
        }
        return (0, Neo4jDatabaseInfo_1.getNeo4jDatabaseInfo)(new Executor_1.Executor(executorConstructorParam));
    }
    wrapResolvers(resolvers) {
        if (!this.schemaModel) {
            throw new Error("Schema Model is not defined");
        }
        const wrapResolverArgs = {
            driver: this.driver,
            config: this.config,
            nodes: this.nodes,
            relationships: this.relationships,
            schemaModel: this.schemaModel,
            plugins: this.plugins,
        };
        const resolversComposition = {
            "Query.*": [(0, wrapper_1.wrapResolver)(wrapResolverArgs)],
            "Mutation.*": [(0, wrapper_1.wrapResolver)(wrapResolverArgs)],
            "Subscription.*": [(0, wrapper_1.wrapSubscription)(wrapResolverArgs)],
        };
        // Merge generated and custom resolvers
        const mergedResolvers = (0, merge_1.mergeResolvers)([resolvers, ...(0, utils_2.asArray)(this.schemaDefinition.resolvers)]);
        return (0, resolvers_composition_1.composeResolvers)(mergedResolvers, resolversComposition);
    }
    generateSchema() {
        return new Promise((resolve) => {
            const document = (0, get_document_1.getDocument)(this.schemaDefinition.typeDefs);
            const { validateTypeDefs, validateResolvers } = this.parseStartupValidationConfig();
            const { nodes, relationships, typeDefs, resolvers } = (0, schema_2.makeAugmentedSchema)(document, {
                features: this.features,
                enableRegex: this.config?.enableRegex,
                validateTypeDefs,
                validateResolvers,
                generateSubscriptions: Boolean(this.plugins?.subscriptions),
                callbacks: this.config.callbacks,
                userCustomResolvers: this.schemaDefinition.resolvers,
            });
            const schemaModel = (0, generate_model_1.generateModel)(document);
            this._nodes = nodes;
            this._relationships = relationships;
            this.schemaModel = schemaModel;
            // Wrap the generated and custom resolvers, which adds a context including the schema to every request
            const wrappedResolvers = this.wrapResolvers(resolvers);
            const schema = (0, schema_1.makeExecutableSchema)({
                ...this.schemaDefinition,
                typeDefs,
                resolvers: wrappedResolvers,
            });
            resolve(this.addDefaultFieldResolvers(schema));
        });
    }
    parseStartupValidationConfig() {
        let validateTypeDefs = true;
        let validateResolvers = true;
        if (this.config?.startupValidation === false) {
            return {
                validateTypeDefs: false,
                validateResolvers: false,
            };
        }
        // TODO - remove in 4.0.0 when skipValidateTypeDefs is removed
        if (this.config?.skipValidateTypeDefs === true)
            validateTypeDefs = false;
        if (typeof this.config?.startupValidation === "object") {
            if (this.config?.startupValidation.typeDefs === false)
                validateTypeDefs = false;
            if (this.config?.startupValidation.resolvers === false)
                validateResolvers = false;
        }
        return {
            validateTypeDefs,
            validateResolvers,
        };
    }
    async pluginsSetup() {
        const subscriptionsPlugin = this.plugins?.subscriptions;
        if (subscriptionsPlugin) {
            subscriptionsPlugin.events.setMaxListeners(0); // Removes warning regarding leak. >10 listeners are expected
            if (subscriptionsPlugin.init) {
                await subscriptionsPlugin.init();
            }
        }
    }
}
exports.default = Neo4jGraphQL;
//# sourceMappingURL=Neo4jGraphQL.js.map