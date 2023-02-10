import type { RelationField, Context } from "../types";
import { Node } from "../classes";
import type { CallbackBucket } from "../classes/CallbackBucket";
import Cypher from "@neo4j/cypher-builder";
type CreateOrConnectInput = {
    where?: {
        node: Record<string, any>;
    };
    onCreate?: {
        node?: Record<string, any>;
        edge?: Record<string, any>;
    };
};
export declare function createConnectOrCreateAndParams({ input, varName, parentVar, relationField, refNode, node, context, withVars, callbackBucket, }: {
    input: CreateOrConnectInput[] | CreateOrConnectInput;
    varName: string;
    parentVar: string;
    relationField: RelationField;
    refNode: Node;
    node: Node;
    context: Context;
    withVars: string[];
    callbackBucket: CallbackBucket;
}): Cypher.CypherResult;
export {};
//# sourceMappingURL=create-connect-or-create-and-params.d.ts.map