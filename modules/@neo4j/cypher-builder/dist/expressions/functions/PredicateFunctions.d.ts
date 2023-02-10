import type { Pattern } from "../../Pattern";
import type { Expr, Predicate } from "../../types";
import type { Variable } from "../../references/Variable";
import { CypherFunction } from "./CypherFunction";
/** Represents a predicate function that can be used in a WHERE statement
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/predicate/)
 * @group Internal
 */
export declare class PredicateFunction extends CypherFunction {
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-any)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function any(variable: Variable, listExpr: Expr, whereFilter?: Predicate): PredicateFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-all)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function all(variable: Variable, listExpr: Expr, whereFilter?: Predicate): PredicateFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-single)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function single(variable: Variable, listExpr: Expr, whereFilter: Predicate): PredicateFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-exists)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function exists(pattern: Pattern): PredicateFunction;
//# sourceMappingURL=PredicateFunctions.d.ts.map