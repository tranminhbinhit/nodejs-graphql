import type { IResolvers } from "@graphql-tools/utils";
import type { DocumentNode } from "graphql";
import type { Neo4jGraphQLCallbacks, Neo4jFeaturesSettings } from "../types";
import type { Node } from "../classes";
import type Relationship from "../classes/Relationship";
declare function makeAugmentedSchema(document: DocumentNode, { features, enableRegex, validateTypeDefs, validateResolvers, generateSubscriptions, callbacks, userCustomResolvers, }?: {
    features?: Neo4jFeaturesSettings;
    enableRegex?: boolean;
    validateTypeDefs: boolean;
    validateResolvers: boolean;
    generateSubscriptions?: boolean;
    callbacks?: Neo4jGraphQLCallbacks;
    userCustomResolvers?: IResolvers | Array<IResolvers>;
}): {
    nodes: Node[];
    relationships: Relationship[];
    typeDefs: DocumentNode;
    resolvers: IResolvers;
};
export default makeAugmentedSchema;
//# sourceMappingURL=make-augmented-schema.d.ts.map