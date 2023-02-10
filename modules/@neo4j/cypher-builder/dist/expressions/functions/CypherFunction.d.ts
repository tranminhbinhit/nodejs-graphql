import type { Variable } from "../../references/Variable";
import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { Expr } from "../../types";
/** Represents a Cypher Function
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare class CypherFunction extends CypherASTNode {
    protected name: string;
    private params;
    /**
     * @hidden
     */
    constructor(name: string, params?: Array<Expr>);
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-coalesce)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function coalesce(expr: Expr, ...optionalExpr: Expr[]): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/spatial/)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function point(variable: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/4.3/functions/spatial/#functions-distance)
 * @group Expressions
 * @category Cypher Functions
 * @deprecated No longer supported in Neo4j 5. Use {@link pointDistance} instead.
 */
export declare function distance(lexpr: Expr, rexpr: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/spatial/#functions-distance)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function pointDistance(lexpr: Expr, rexpr: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-labels)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function labels(nodeRef: Variable): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-datetime)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function cypherDatetime(): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-date)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function cypherDate(): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-coalesce)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function cypherLocalDatetime(): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localdatetime)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function cypherLocalTime(): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-time)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function cypherTime(): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-count)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function count(expr: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-min)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function min(expr: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-max)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function max(expr: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function avg(expr: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-sum)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function sum(expr: Expr): CypherFunction;
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-randomuuid)
 * @group Expressions
 * @category Cypher Functions
 */
export declare function randomUUID(): CypherFunction;
//# sourceMappingURL=CypherFunction.d.ts.map