import type { JwtPayload, Neo4jGraphQLSubscriptionsPlugin } from "../../../types";
export type SubscriptionContext = {
    plugin: Neo4jGraphQLSubscriptionsPlugin;
    jwt?: JwtPayload;
};
export type SubscriptionConnectionContext = {
    connectionParams?: {
        authorization?: string;
    };
    jwt?: JwtPayload;
};
//# sourceMappingURL=types.d.ts.map