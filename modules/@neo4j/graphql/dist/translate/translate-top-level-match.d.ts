import type { AuthOperations, Context } from "../types";
import type { Node } from "../classes";
import Cypher from "@neo4j/cypher-builder";
export declare function translateTopLevelMatch({ matchNode, node, context, operation, }: {
    matchNode: Cypher.Node;
    context: Context;
    node: Node;
    operation: AuthOperations;
}): Cypher.CypherResult;
type CreateMatchClauseReturn = {
    matchClause: Cypher.Match | Cypher.db.FullTextQueryNodes;
    preComputedWhereFieldSubqueries: Cypher.CompositeClause | undefined;
    whereClause: Cypher.Match | Cypher.db.FullTextQueryNodes | Cypher.With;
};
export declare function createMatchClause({ matchNode, node, context, operation, }: {
    matchNode: Cypher.Node;
    context: Context;
    node: Node;
    operation: AuthOperations;
}): CreateMatchClauseReturn;
export {};
//# sourceMappingURL=translate-top-level-match.d.ts.map