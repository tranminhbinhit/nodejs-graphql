import type { Variable } from "../..";
import type { Expr } from "../../types";
import { CypherFunction } from "./CypherFunction";
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-size)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function size(expr: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-collect)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function collect(expr: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-head)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function head(expr: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-last)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function last(expr: Expr): CypherFunction;
/** Reduce a list by executing given expression.
 * ```cypher
 * reduce(totalAge = 0, n IN nodes(p) | totalAge + n.age)
 * ```
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-reduce)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function reduce(accVariable: Variable, defaultValue: Expr, variable: Variable, listExpr: Expr, mapExpr: Expr): CypherFunction;
//# sourceMappingURL=ListFunctions.d.ts.map