import type { CypherEnvironment } from "../../Environment";
import type { CypherCompilable, Expr } from "../../types";
import { ListIndex } from "./ListIndex";
/** Represents a List
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/lists/)
 * @group Expressions
 * @example
 * ```ts
 * new Cypher.List([new Cypher.Literal("1"), new Cypher.Literal("2"), new Cypher.Literal("3")])
 * ```
 * Translates to
 * ```cypher
 * [ "1", "2", "3" ]
 * ```
 */
export declare class ListExpr implements CypherCompilable {
    private value;
    constructor(value: Expr[]);
    private serializeList;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
    /** Access individual elements in the list via the ListIndex class*/
    index(index: number): ListIndex;
}
//# sourceMappingURL=ListExpr.d.ts.map