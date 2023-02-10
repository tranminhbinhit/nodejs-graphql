import type { FieldDefinitionNode } from "graphql";
type CypherMeta = {
    statement: string;
    columnName?: string;
};
export declare function getCypherMeta(field: FieldDefinitionNode, interfaceField?: FieldDefinitionNode): CypherMeta | undefined;
export {};
//# sourceMappingURL=get-cypher-meta.d.ts.map