import type { CypherEnvironment } from "../Environment";
import { Clause } from "./Clause";
import { WithWith } from "./mixins/WithWith";
import type { DeleteClause } from "./sub-clauses/Delete";
import type { SetClause } from "./sub-clauses/Set";
import type { RemoveClause } from "./sub-clauses/Remove";
import type { Create } from "./Create";
import type { Merge } from "./Merge";
import type { Variable } from "../references/Variable";
import type { Expr } from "../types";
export interface Foreach extends WithWith {
}
type ForeachClauses = Foreach | SetClause | RemoveClause | Create | Merge | DeleteClause;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/foreach/)
 * @group Clauses
 */
export declare class Foreach extends Clause {
    private variable;
    private listExpr;
    private mapClause;
    constructor(variable: Variable, listExpr: Expr, mapClause: ForeachClauses);
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
export {};
//# sourceMappingURL=Foreach.d.ts.map