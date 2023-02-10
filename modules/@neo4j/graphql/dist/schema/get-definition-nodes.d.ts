import type { DirectiveDefinitionNode, DocumentNode, EnumTypeDefinitionNode, InputObjectTypeDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode, ScalarTypeDefinitionNode, UnionTypeDefinitionNode } from "graphql";
export type DefinitionNodes = {
    objectTypes: ObjectTypeDefinitionNode[];
    scalarTypes: ScalarTypeDefinitionNode[];
    enumTypes: EnumTypeDefinitionNode[];
    inputObjectTypes: InputObjectTypeDefinitionNode[];
    interfaceTypes: InterfaceTypeDefinitionNode[];
    directives: DirectiveDefinitionNode[];
    unionTypes: UnionTypeDefinitionNode[];
};
export declare function getDefinitionNodes(document: DocumentNode): DefinitionNodes;
//# sourceMappingURL=get-definition-nodes.d.ts.map