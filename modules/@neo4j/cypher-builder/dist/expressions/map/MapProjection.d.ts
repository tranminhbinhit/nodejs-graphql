import type { CypherEnvironment } from "../../Environment";
import type { CypherCompilable, Expr } from "../../types";
import type { Variable } from "../../references/Variable";
/** Represents a Map projection
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/maps/#cypher-map-projection)
 * @group Expressions
 * @example
 * ```cypher
 * this { .title }
 * ```
 */
export declare class MapProjection implements CypherCompilable {
    private extraValues;
    private variable;
    private projection;
    constructor(variable: Variable, projection: string[], extraValues?: Record<string, Expr>);
    set(values: Record<string, Expr> | string): void;
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=MapProjection.d.ts.map