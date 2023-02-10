import type { GraphQLWhereArg, Context, PredicateReturn } from "../../types";
import type { GraphElement } from "../../classes";
import Cypher from "@neo4j/cypher-builder";
import type { ListPredicate } from "./utils";
/** Translate a target node and GraphQL input into a Cypher operation o valid where expression */
export declare function createWherePredicate({ targetElement, whereInput, context, element, listPredicateStr, }: {
    targetElement: Cypher.Variable;
    whereInput: GraphQLWhereArg;
    context: Context;
    element: GraphElement;
    listPredicateStr?: ListPredicate;
}): PredicateReturn;
//# sourceMappingURL=create-where-predicate.d.ts.map