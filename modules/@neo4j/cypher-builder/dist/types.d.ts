import type { PropertyRef } from "./references/PropertyRef";
import type { CypherFunction } from "./expressions/functions/CypherFunction";
import type { Literal } from "./references/Literal";
import type { Exists } from "./expressions/Exists";
import type { CypherEnvironment } from "./Environment";
import type { MapExpr } from "./expressions/map/MapExpr";
import type { BooleanOp } from "./expressions/operations/boolean";
import type { ComparisonOp } from "./expressions/operations/comparison";
import type { RawCypher } from "./clauses/RawCypher";
import type { PredicateFunction } from "./expressions/functions/PredicateFunctions";
import type { Case } from "./expressions/Case";
import type { MathOp } from "./expressions/operations/math";
import type { ListComprehension } from "./expressions/list/ListComprehension";
import type { PatternComprehension } from "./expressions/list/PatternComprehension";
import type { ListExpr } from "./expressions/list/ListExpr";
import type { MapProjection } from "./expressions/map/MapProjection";
import type { HasLabel } from "./expressions/HasLabel";
import type { Reference } from "./references/Reference";
import type { ApocFunction, ApocPredicate, ApocProcedure } from "./apoc/types";
import type { ListIndex } from "./expressions/list/ListIndex";
export type Operation = BooleanOp | ComparisonOp | MathOp;
/** Represents a Cypher Expression
 *  @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/)
 */
export type Expr = Operation | Reference | Literal | PropertyRef | CypherFunction | Predicate | ListComprehension | PatternComprehension | MapExpr | MapProjection | ListExpr | ListIndex | ApocFunction | Case<ComparisonOp>;
/** Represents a predicate statement (i.e returns a boolean). Note that RawCypher is only added for compatibility */
export type Predicate = BooleanOp | ComparisonOp | RawCypher | Exists | PredicateFunction | ApocPredicate | Literal<boolean> | Case | HasLabel;
/** Represents a procedure, invocable with the CALL statement */
export type Procedure = ApocProcedure;
export type CypherResult = {
    cypher: string;
    params: Record<string, string>;
};
/** Defines the interface for a class that can be compiled into Cypher */
export interface CypherCompilable {
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=types.d.ts.map