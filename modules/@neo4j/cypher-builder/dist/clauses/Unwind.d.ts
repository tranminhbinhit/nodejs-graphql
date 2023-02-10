import type { CypherEnvironment } from "../Environment";
import { ProjectionColumn } from "./sub-clauses/Projection";
import { Clause } from "./Clause";
import { WithWith } from "./mixins/WithWith";
export interface Unwind extends WithWith {
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/unwind/)
 * @group Clauses
 */
export declare class Unwind extends Clause {
    private projection;
    constructor(...columns: Array<"*" | ProjectionColumn>);
    addColumns(...columns: Array<"*" | ProjectionColumn>): void;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=Unwind.d.ts.map