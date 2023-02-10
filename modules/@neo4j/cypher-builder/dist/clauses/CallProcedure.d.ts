import type { CypherEnvironment } from "../Environment";
import { Clause } from "./Clause";
import type { Procedure } from "../types";
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/call/)
 * @group Clauses
 */
export declare class CallProcedure extends Clause {
    private procedure;
    constructor(procedure: Procedure);
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=CallProcedure.d.ts.map