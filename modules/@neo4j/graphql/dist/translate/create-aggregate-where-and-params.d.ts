import Cypher from "@neo4j/cypher-builder";
import type { Relationship } from "../classes";
import type { RelationField, Context, GraphQLWhereArg, PredicateReturn } from "../types";
import { ListPredicate } from "./where/utils";
import { LogicalOperator } from "./utils/logical-operators";
type WhereFilter = Record<string | LogicalOperator, any>;
export type AggregateWhereInput = {
    count: number;
    count_LT: number;
    count_LTE: number;
    count_GT: number;
    count_GTE: number;
    node: WhereFilter;
    edge: WhereFilter;
} & WhereFilter;
export declare function aggregatePreComputedWhereFields(value: GraphQLWhereArg, relationField: RelationField, relationship: Relationship | undefined, context: Context, matchNode: Cypher.Variable, listPredicateStr?: ListPredicate): PredicateReturn;
export {};
//# sourceMappingURL=create-aggregate-where-and-params.d.ts.map