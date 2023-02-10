import type { Context, PredicateReturn } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
import { GraphElement } from "../../../classes";
import { ListPredicate } from "../utils";
/** Translates a property into its predicate filter */
export declare function createPropertyWhere({ key, value, element, targetElement, context, listPredicateStr, requiredVariables, }: {
    key: string;
    value: any;
    element: GraphElement;
    targetElement: Cypher.Variable;
    context: Context;
    listPredicateStr?: ListPredicate;
    requiredVariables: Cypher.Variable[];
}): PredicateReturn;
//# sourceMappingURL=create-property-where.d.ts.map