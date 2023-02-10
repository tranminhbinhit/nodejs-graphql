import type { CypherEnvironment } from "../Environment";
import type { Expr } from "../types";
import type { Literal } from "../references/Literal";
import type { Variable } from "../references/Variable";
import { Clause } from "./Clause";
import { WithOrder } from "./mixins/WithOrder";
import { WithReturn } from "./mixins/WithReturn";
import { WithWhere } from "./mixins/WithWhere";
export type WithProjection = Variable | [Expr, string | Variable | Literal];
export interface With extends WithOrder, WithReturn, WithWhere {
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/with/)
 * @group Clauses
 */
export declare class With extends Clause {
    private projection;
    private isDistinct;
    private withStatement;
    constructor(...columns: Array<"*" | WithProjection>);
    addColumns(...columns: Array<"*" | WithProjection>): this;
    distinct(): this;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
    with(...columns: ("*" | WithProjection)[]): With;
}
//# sourceMappingURL=With.d.ts.map