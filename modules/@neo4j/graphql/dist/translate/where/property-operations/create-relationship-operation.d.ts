import type { Context, GraphQLWhereArg, RelationField, PredicateReturn } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
export declare function createRelationshipOperation({ relationField, context, parentNode, operator, value, isNot, requiredVariables, }: {
    relationField: RelationField;
    context: Context;
    parentNode: Cypher.Node;
    operator: string | undefined;
    value: GraphQLWhereArg;
    isNot: boolean;
    requiredVariables: Cypher.Variable[];
}): PredicateReturn;
export declare function createRelationshipPredicate({ matchPattern, listPredicateStr, childNode, innerOperation, edgePredicate, }: {
    matchPattern: Cypher.Pattern;
    listPredicateStr: string;
    childNode: Cypher.Node;
    innerOperation: Cypher.Predicate | undefined;
    edgePredicate?: boolean;
}): Cypher.Predicate | undefined;
//# sourceMappingURL=create-relationship-operation.d.ts.map