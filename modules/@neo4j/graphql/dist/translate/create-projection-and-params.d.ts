import type { ResolveTree } from "graphql-parse-resolve-info";
import Cypher from "@neo4j/cypher-builder";
import type { Node } from "../classes";
import type { Context } from "../types";
export interface ProjectionMeta {
    authValidateStrs?: string[];
    cypherSortFields?: string[];
}
export type ProjectionResult = {
    projection: string;
    params: Record<string, any>;
    meta: ProjectionMeta;
    subqueries: Array<Cypher.Clause>;
    subqueriesBeforeSort: Array<Cypher.Clause>;
};
export default function createProjectionAndParams({ resolveTree, node, context, chainStr, varName, literalElements, resolveType, }: {
    resolveTree: ResolveTree;
    node: Node;
    context: Context;
    chainStr?: string;
    varName: string;
    literalElements?: boolean;
    resolveType?: boolean;
}): ProjectionResult;
//# sourceMappingURL=create-projection-and-params.d.ts.map