import type { CypherEnvironment } from "../../Environment";
import type { Variable } from "../../references/Variable";
import type { CypherCompilable } from "../../types";
import type { ListExpr } from "./ListExpr";
/** Access individual elements in the list
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/lists/)
 * @group Expressions
 * @hidden
 * @example
 * ```ts
 * const list = new Cypher.List([new Cypher.Literal("1"), new Cypher.Literal("2"), new Cypher.Literal("3")]);
 * const listIndex = new ListIndex(list, 0);
 * ```
 * Translates to
 * ```cypher
 * [ "1", "2", "3" ][0]
 * ```
 */
export declare class ListIndex implements CypherCompilable {
    private value;
    private index;
    /**
     * @hidden
     */
    constructor(variable: Variable | ListExpr, index: number);
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=ListIndex.d.ts.map