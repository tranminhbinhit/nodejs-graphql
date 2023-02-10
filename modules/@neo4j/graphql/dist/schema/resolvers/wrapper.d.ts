import type { GraphQLResolveInfo } from "graphql";
import type { Driver } from "neo4j-driver";
import type { Neo4jGraphQLConfig, Node, Relationship } from "../../classes";
import { Neo4jDatabaseInfo } from "../../classes/Neo4jDatabaseInfo";
import type { Context, Neo4jGraphQLPlugins } from "../../types";
import type { SubscriptionConnectionContext } from "./subscriptions/types";
import type { Neo4jGraphQLSchemaModel } from "../../schema-model/Neo4jGraphQLSchemaModel";
type WrapResolverArguments = {
    driver?: Driver;
    config: Neo4jGraphQLConfig;
    nodes: Node[];
    relationships: Relationship[];
    schemaModel: Neo4jGraphQLSchemaModel;
    plugins?: Neo4jGraphQLPlugins;
    dbInfo?: Neo4jDatabaseInfo;
};
export declare const wrapResolver: ({ driver, config, nodes, relationships, schemaModel, plugins, dbInfo }: WrapResolverArguments) => (next: any) => (root: any, args: any, context: Context, info: GraphQLResolveInfo) => Promise<any>;
export declare const wrapSubscription: (resolverArgs: WrapResolverArguments) => (next: any) => (root: any, args: any, context: SubscriptionConnectionContext | undefined, info: GraphQLResolveInfo) => Promise<any>;
export {};
//# sourceMappingURL=wrapper.d.ts.map