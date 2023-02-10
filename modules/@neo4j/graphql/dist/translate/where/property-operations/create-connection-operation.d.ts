import Cypher from "@neo4j/cypher-builder";
import type { ConnectionField, ConnectionWhereArg, Context, PredicateReturn } from "../../../types";
import type { Node, Relationship } from "../../../classes";
import { ListPredicate } from "../utils";
export declare function createConnectionOperation({ connectionField, value, context, parentNode, operator, requiredVariables, }: {
    connectionField: ConnectionField;
    value: any;
    context: Context;
    parentNode: Cypher.Node;
    operator: string | undefined;
    requiredVariables: Cypher.Variable[];
}): PredicateReturn;
export declare function createConnectionWherePropertyOperation({ context, whereInput, edgeRef, targetNode, node, edge, listPredicateStr, }: {
    whereInput: ConnectionWhereArg;
    context: Context;
    node: Node;
    edge: Relationship;
    edgeRef: Cypher.Variable;
    targetNode: Cypher.Node;
    listPredicateStr?: ListPredicate;
}): PredicateReturn;
/** Checks if a where property has an explicit interface inside _on */
export declare function hasExplicitNodeInInterfaceWhere({ whereInput, node, }: {
    whereInput: ConnectionWhereArg;
    node: Node;
}): boolean;
//# sourceMappingURL=create-connection-operation.d.ts.map