import type { Neo4jDatabaseInfo } from "../../../classes/Neo4jDatabaseInfo";
import type { PointField } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
/** Translates a point comparison operation */
export declare function createPointComparisonOperation({ operator, propertyRefOrCoalesce, param, pointField, neo4jDatabaseInfo, }: {
    operator: string | undefined;
    propertyRefOrCoalesce: Cypher.PropertyRef | Cypher.Function | Cypher.Variable;
    param: Cypher.Param;
    pointField: PointField;
    neo4jDatabaseInfo: Neo4jDatabaseInfo;
}): Cypher.ComparisonOp;
//# sourceMappingURL=create-point-comparison-operation.d.ts.map