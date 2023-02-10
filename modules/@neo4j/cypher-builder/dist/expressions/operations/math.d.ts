import type { Expr } from "../../types";
import type { CypherEnvironment } from "../../Environment";
import { CypherASTNode } from "../../CypherASTNode";
type MathOperator = "+" | "-";
export declare class MathOp extends CypherASTNode {
    private operator;
    private exprs;
    constructor(operator: MathOperator, exprs?: Expr[]);
    getCypher(env: CypherEnvironment): string;
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-mathematical)
 * @see [String Concatenation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#syntax-concatenating-two-strings)
 * @group Expressions
 * @category Operators
 */
export declare function plus(leftExpr: Expr, rightExpr: Expr): MathOp;
export declare function plus(...exprs: Expr[]): MathOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-mathematical)
 * @group Expressions
 * @category Operators
 */
export declare function minus(leftExpr: Expr, rightExpr: Expr): MathOp;
export {};
//# sourceMappingURL=math.d.ts.map