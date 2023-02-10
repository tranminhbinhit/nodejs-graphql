import type { ResolveTree } from "graphql-parse-resolve-info";
import type { Node } from "../../classes";
import type { Context } from "../../types";
export declare function createFieldAggregation({ context, nodeLabel, node, field, }: {
    context: Context;
    nodeLabel: string;
    node: Node;
    field: ResolveTree;
}): {
    projectionCypher: string;
    projectionSubqueryCypher: string;
    projectionParams: Record<string, any>;
} | undefined;
//# sourceMappingURL=create-field-aggregation.d.ts.map