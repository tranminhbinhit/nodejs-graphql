import Cypher from "@neo4j/cypher-builder";
import type { Node } from "../classes";
import type { AuthOperations, BaseField, Context } from "../types";
interface Allow {
    varName: string | Cypher.Node;
    parentNode: Node;
}
interface Bind {
    varName: string | Cypher.Node;
    parentNode: Node;
}
interface Where {
    varName: string | Cypher.Node;
    node: Node;
}
export declare function createAuthAndParams({ entity, operations, skipRoles, skipIsAuthenticated, allow, context, escapeQuotes, bind, where, }: {
    entity: Node | BaseField;
    operations?: AuthOperations | AuthOperations[];
    skipRoles?: boolean;
    skipIsAuthenticated?: boolean;
    allow?: Allow;
    context: Context;
    escapeQuotes?: boolean;
    bind?: Bind;
    where?: Where;
}): [string, Record<string, any>];
export declare function createAuthPredicates({ entity, operations, skipRoles, skipIsAuthenticated, allow, context, escapeQuotes, bind, where, }: {
    entity: Node | BaseField;
    operations?: AuthOperations | AuthOperations[];
    skipRoles?: boolean;
    skipIsAuthenticated?: boolean;
    allow?: Allow;
    context: Context;
    escapeQuotes?: boolean;
    bind?: Bind;
    where?: Where;
}): Cypher.Predicate | undefined;
export {};
//# sourceMappingURL=create-auth-and-params.d.ts.map