import type { CypherEnvironment } from "../Environment";
import type { Variable } from "../references/Variable";
import { Clause } from "./Clause";
import { WithReturn } from "./mixins/WithReturn";
import { WithWith } from "./mixins/WithWith";
import { WithUnwind } from "./mixins/WithUnwind";
export interface Call extends WithReturn, WithWith, WithUnwind {
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/call-subquery/)
 * @group Clauses
 */
export declare class Call extends Clause {
    private subQuery;
    private importWith;
    constructor(subQuery: Clause);
    innerWith(...params: Variable[]): this;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=Call.d.ts.map