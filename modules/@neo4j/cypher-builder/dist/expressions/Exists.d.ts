import type { CypherEnvironment } from "../Environment";
import type { Clause } from "../clauses/Clause";
import { CypherASTNode } from "../CypherASTNode";
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#existential-subqueries)
 * @group Expressions
 */
export declare class Exists extends CypherASTNode {
    private subQuery;
    constructor(subQuery: Clause, parent?: CypherASTNode);
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=Exists.d.ts.map