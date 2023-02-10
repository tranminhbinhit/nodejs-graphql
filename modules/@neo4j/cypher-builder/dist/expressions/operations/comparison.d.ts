import type { Expr } from "../../types";
import type { CypherEnvironment } from "../../Environment";
import { CypherASTNode } from "../../CypherASTNode";
type ComparisonOperator = "=" | "<" | ">" | "<>" | "<=" | ">=" | "IS NULL" | "IS NOT NULL" | "IN" | "CONTAINS" | "STARTS WITH" | "ENDS WITH" | "=~";
/**
 *  @group Internal
 */
export declare class ComparisonOp extends CypherASTNode {
    private operator;
    private leftExpr;
    private rightExpr;
    constructor(operator: ComparisonOperator, left: Expr | undefined, right: Expr | undefined);
    getCypher(env: CypherEnvironment): string;
}
/** Generates an equal (=) operator between the 2 expressions
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function eq(leftExpr: Expr, rightExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function gt(leftExpr: Expr, rightExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function gte(leftExpr: Expr, rightExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function lt(leftExpr: Expr, rightExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function lte(leftExpr: Expr, rightExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function isNull(childExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function isNotNull(childExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function inOp(leftExpr: Expr, rightExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function contains(leftExpr: Expr, rightExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function startsWith(leftExpr: Expr, rightExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function endsWith(leftExpr: Expr, rightExpr: Expr): ComparisonOp;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Expressions
 * @category Operators
 */
export declare function matches(leftExpr: Expr, rightExpr: Expr): ComparisonOp;
export {};
//# sourceMappingURL=comparison.d.ts.map