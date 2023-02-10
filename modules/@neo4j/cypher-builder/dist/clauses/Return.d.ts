import { WithOrder } from "./mixins/WithOrder";
import { ProjectionColumn } from "./sub-clauses/Projection";
import type { CypherEnvironment } from "../Environment";
import { Clause } from "./Clause";
export interface Return extends WithOrder {
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/return/)
 * @group Clauses
 */
export declare class Return extends Clause {
    private projection;
    private isDistinct;
    constructor(...columns: Array<"*" | ProjectionColumn>);
    addColumns(...columns: Array<"*" | ProjectionColumn>): this;
    distinct(): this;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=Return.d.ts.map