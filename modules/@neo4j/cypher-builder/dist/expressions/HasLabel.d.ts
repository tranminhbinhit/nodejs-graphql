import { CypherASTNode } from "../CypherASTNode";
import type { CypherEnvironment } from "../Environment";
import type { NodeRef } from "../references/NodeRef";
/** Generates a predicate to check if a node has a label
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#existential-subqueries)
 * @group Expressions
 * @example
 * ```cypher
 * MATCH(this) WHERE this:MyNode
 * ```
 */
export declare class HasLabel extends CypherASTNode {
    private node;
    private expectedLabels;
    constructor(node: NodeRef, expectedLabels: string[]);
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=HasLabel.d.ts.map