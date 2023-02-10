import type { Driver } from "neo4j-driver";
import type { GraphQLSchema } from "graphql";
import type { IExecutableSchemaDefinition } from "@graphql-tools/schema";
import type { DriverConfig, CypherQueryOptions, Neo4jGraphQLPlugins, Neo4jGraphQLCallbacks, Neo4jFeaturesSettings, StartupValidationConfig } from "../types";
import type Node from "./Node";
import type Relationship from "./Relationship";
import type { AssertIndexesAndConstraintsOptions } from "./utils/asserts-indexes-and-constraints";
export interface Neo4jGraphQLConfig {
    driverConfig?: DriverConfig;
    enableRegex?: boolean;
    enableDebug?: boolean;
    /**
     * @deprecated This argument has been deprecated and will be removed in v4.0.0.
     * Please use startupValidation instead. More information can be found at
     * https://neo4j.com/docs/graphql-manual/current/guides/v4-migration/#startup-validation
     */
    skipValidateTypeDefs?: boolean;
    startupValidation?: StartupValidationConfig;
    queryOptions?: CypherQueryOptions;
    callbacks?: Neo4jGraphQLCallbacks;
}
export interface Neo4jGraphQLConstructor extends IExecutableSchemaDefinition {
    features?: Neo4jFeaturesSettings;
    config?: Neo4jGraphQLConfig;
    driver?: Driver;
    plugins?: Neo4jGraphQLPlugins;
}
declare class Neo4jGraphQL {
    private config;
    private driver?;
    private features?;
    private schemaDefinition;
    private _nodes?;
    private _relationships?;
    private plugins?;
    private schemaModel?;
    private schema?;
    private dbInfo?;
    constructor(input: Neo4jGraphQLConstructor);
    get nodes(): Node[];
    get relationships(): Relationship[];
    getSchema(): Promise<GraphQLSchema>;
    checkNeo4jCompat(input?: {
        driver?: Driver;
        driverConfig?: DriverConfig;
    }): Promise<void>;
    assertIndexesAndConstraints(input?: {
        driver?: Driver;
        driverConfig?: DriverConfig;
        options?: AssertIndexesAndConstraintsOptions;
    }): Promise<void>;
    private addDefaultFieldResolvers;
    private checkEnableDebug;
    private getNeo4jDatabaseInfo;
    private wrapResolvers;
    private generateSchema;
    private parseStartupValidationConfig;
    private pluginsSetup;
}
export default Neo4jGraphQL;
//# sourceMappingURL=Neo4jGraphQL.d.ts.map