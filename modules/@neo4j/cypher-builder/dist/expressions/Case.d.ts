import type { CypherEnvironment } from "../Environment";
import { CypherASTNode } from "../CypherASTNode";
import type { Expr, Predicate } from "../types";
/** Case statement
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#query-syntax-case)
 * @group Expressions
 */
export declare class Case<C extends Expr | undefined = undefined> extends CypherASTNode {
    private comparator;
    private whenClauses;
    private default;
    constructor(comparator?: C);
    when(expr: C extends Expr ? Expr : Predicate): When<C>;
    else(defaultExpr: Expr): this;
    getCypher(env: CypherEnvironment): string;
}
declare class When<T extends Expr | undefined> extends CypherASTNode {
    protected parent: Case<T>;
    private predicate;
    private result;
    constructor(parent: Case<T>, predicate: Expr);
    then(expr: Expr): Case<T>;
    getCypher(env: CypherEnvironment): string;
}
export {};
//# sourceMappingURL=Case.d.ts.map