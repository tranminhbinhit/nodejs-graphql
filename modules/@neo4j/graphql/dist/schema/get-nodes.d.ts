import type { IResolvers } from "@graphql-tools/utils";
import { Node } from "../classes";
import type { Neo4jGraphQLCallbacks } from "../types";
import type { DefinitionNodes } from "./get-definition-nodes";
type Nodes = {
    nodes: Node[];
    pointInTypeDefs: boolean;
    cartesianPointInTypeDefs: boolean;
    floatWhereInTypeDefs: boolean;
    relationshipPropertyInterfaceNames: Set<string>;
    interfaceRelationshipNames: Set<string>;
};
declare function getNodes(definitionNodes: DefinitionNodes, options: {
    callbacks?: Neo4jGraphQLCallbacks;
    userCustomResolvers?: IResolvers | Array<IResolvers>;
    validateResolvers: boolean;
}): Nodes;
export default getNodes;
//# sourceMappingURL=get-nodes.d.ts.map