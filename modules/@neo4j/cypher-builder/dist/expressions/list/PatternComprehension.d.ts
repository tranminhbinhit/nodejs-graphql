import { WithWhere } from "../../clauses/mixins/WithWhere";
import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import { MatchableElement, Pattern } from "../../Pattern";
import type { Expr } from "../../types";
export interface PatternComprehension extends WithWhere {
}
/** Represents a Pattern comprehension
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/lists/#cypher-pattern-comprehension)
 * @group Expressions
 */
export declare class PatternComprehension extends CypherASTNode {
    private pattern;
    private mapExpr;
    constructor(pattern: Pattern | MatchableElement, mapExpr?: Expr);
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=PatternComprehension.d.ts.map