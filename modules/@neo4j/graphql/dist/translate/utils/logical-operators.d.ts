import Cypher from "@neo4j/cypher-builder";
import { LOGICAL_OPERATORS } from "../../constants";
export type LogicalOperator = typeof LOGICAL_OPERATORS[number];
export declare function getCypherLogicalOperator(graphQLOperator: LogicalOperator | string): ((...predicates: Cypher.Predicate[]) => Cypher.BooleanOp);
export declare function getCypherLogicalOperator(graphQLOperator: LogicalOperator | string): ((child: Cypher.Predicate) => Cypher.BooleanOp);
export declare function isLogicalOperator(key: string): boolean;
//# sourceMappingURL=logical-operators.d.ts.map