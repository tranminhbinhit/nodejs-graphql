import { CypherASTNode } from "../../CypherASTNode";
import type { Predicate } from "../../types";
type BooleanOperator = "AND" | "NOT" | "OR";
/**
 *  @group Internal
 */
export declare abstract class BooleanOp extends CypherASTNode {
    protected operator: BooleanOperator;
    constructor(operator: BooleanOperator);
}
/** Generates an `AND` operator between the given predicates
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean)
 * @group Expressions
 * @category Operators
 * @example
 * ```ts
 * console.log("Test", Cypher.and(
 *     Cypher.eq(new Cypher.Literal("Hi"), new Cypher.Literal("Hi")),
 *     new Cypher.Literal(false)).toString()
 * );
 * ```
 * Translates to
 * ```cypher
 * "Hi" = "Hi" AND false
 * ```
 *
 */
export declare function and(left: Predicate, right: Predicate, ...extra: Array<Predicate | undefined>): BooleanOp;
export declare function and(...ops: Array<Predicate>): Predicate;
export declare function and(...ops: Array<Predicate | undefined>): Predicate | undefined;
/** Generates an `NOT` operator before the given predicate
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean)
 * @group Expressions
 * @category Operators
 * @example
 * ```ts
 * console.log("Test", Cypher.not(
 *     Cypher.eq(new Cypher.Literal("Hi"), new Cypher.Literal("Hi"))
 * );
 * ```
 * Translates to
 * ```cypher
 * NOT "Hi" = "Hi"
 * ```
 *
 */
export declare function not(child: Predicate): BooleanOp;
/** Generates an `OR` operator between the given predicates
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean)
 * @group Expressions
 * @category Operators
 * @example
 * ```ts
 * console.log("Test", Cypher.or(
 *     Cypher.eq(new Cypher.Literal("Hi"), new Cypher.Literal("Hi")),
 *     new Cypher.Literal(false)).toString()
 * );
 * ```
 * Translates to
 * ```cypher
 * "Hi" = "Hi" OR false
 * ```
 *
 */
export declare function or(left: Predicate, right: Predicate, ...extra: Array<Predicate | undefined>): BooleanOp;
export declare function or(...ops: Array<Predicate>): Predicate;
export declare function or(...ops: Array<Predicate | undefined>): Predicate | undefined;
export {};
//# sourceMappingURL=boolean.d.ts.map