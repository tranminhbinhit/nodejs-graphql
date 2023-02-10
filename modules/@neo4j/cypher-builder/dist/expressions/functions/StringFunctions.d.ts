import type { Expr } from "../../types";
import { CypherFunction } from "./CypherFunction";
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function left(original: Expr, length: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function lTrim(original: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function replace(original: Expr, search: Expr, replace: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function reverse(original: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function right(original: Expr, length: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function rTrim(original: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function split(original: Expr, delimiter: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function substring(original: Expr, start: Expr, length?: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function toLower(original: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function toString(expression: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function toStringOrNull(expression: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function toUpper(original: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/string/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function trim(original: Expr): CypherFunction;
//# sourceMappingURL=StringFunctions.d.ts.map