import type { ResolveTree } from "graphql-parse-resolve-info";
import type { Node } from "../../classes";
import type { Context, RelationField } from "../../types";
import Cypher from "@neo4j/cypher-builder";
export declare function createCountExpression({ sourceNode, relationAggregationField, referenceNode, context, field, authCallWhere, targetNode, }: {
    sourceNode: Cypher.Node;
    referenceNode: Node;
    context: Context;
    relationAggregationField: RelationField;
    field: ResolveTree;
    authCallWhere: Cypher.Predicate | undefined;
    targetNode: Cypher.Node;
}): {
    countProjection: Cypher.Expr;
    preComputedSubqueries: Cypher.CompositeClause | undefined;
};
//# sourceMappingURL=create-count-expression.d.ts.map