import type { Neo4jDatabaseInfo } from "../../../classes/Neo4jDatabaseInfo";
import type { PointField, PrimitiveField } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
/** Translates an atomic comparison operation (e.g. "this0 <= $param0") */
export declare function createComparisonOperation({ operator, propertyRefOrCoalesce, param, durationField, pointField, neo4jDatabaseInfo, }: {
    operator: string | undefined;
    propertyRefOrCoalesce: Cypher.PropertyRef | Cypher.Function | Cypher.Variable;
    param: Cypher.Param;
    durationField: PrimitiveField | undefined;
    pointField: PointField | undefined;
    neo4jDatabaseInfo: Neo4jDatabaseInfo;
}): Cypher.ComparisonOp;
export declare function createBaseOperation({ operator, property, param, }: {
    operator: string;
    property: Cypher.Expr;
    param: Cypher.Expr;
}): Cypher.ComparisonOp;
//# sourceMappingURL=create-comparison-operation.d.ts.map