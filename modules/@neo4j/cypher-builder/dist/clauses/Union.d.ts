import type { CypherEnvironment } from "../Environment";
import { Clause } from "./Clause";
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/union/)
 * @group Clauses
 */
export declare class Union extends Clause {
    private subqueries;
    private includeAll;
    constructor(...subqueries: Clause[]);
    all(): this;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=Union.d.ts.map