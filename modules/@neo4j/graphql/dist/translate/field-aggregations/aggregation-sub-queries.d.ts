import Cypher from "@neo4j/cypher-builder";
export declare function createMatchWherePattern(matchPattern: Cypher.Relationship, directed: boolean, preComputedWhereFields: Cypher.CompositeClause | undefined, auth: Cypher.Predicate | undefined, wherePredicate: Cypher.Predicate | undefined): Cypher.Clause;
export declare function stringAggregationQuery(matchWherePattern: Cypher.Clause, fieldName: string, fieldRef: Cypher.Variable, targetAlias: Cypher.Node | Cypher.Relationship): Cypher.RawCypher;
export declare function numberAggregationQuery(matchWherePattern: Cypher.Clause, fieldName: string, fieldRef: Cypher.Variable, targetAlias: Cypher.Node | Cypher.Relationship): Cypher.RawCypher;
export declare function defaultAggregationQuery(matchWherePattern: Cypher.Clause, fieldName: string, fieldRef: Cypher.Variable, targetAlias: Cypher.Node | Cypher.Relationship): Cypher.RawCypher;
export declare function dateTimeAggregationQuery(matchWherePattern: Cypher.Clause, fieldName: string, fieldRef: Cypher.Variable, targetAlias: Cypher.Node | Cypher.Relationship): Cypher.RawCypher;
//# sourceMappingURL=aggregation-sub-queries.d.ts.map