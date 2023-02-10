import type { CypherEnvironment } from "../../Environment";
import type { CypherCompilable, Expr } from "../../types";
/** Represents a Map
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/maps/)
 * @group Expressions
 */
export declare class MapExpr implements CypherCompilable {
    private value;
    constructor(value?: Record<string, Expr | undefined>);
    set(key: string, value: Expr): void;
    set(values: Record<string, Expr>): void;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=MapExpr.d.ts.map