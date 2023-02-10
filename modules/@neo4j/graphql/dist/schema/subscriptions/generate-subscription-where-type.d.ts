import type { InputTypeComposer, SchemaComposer } from "graphql-compose";
import type { Node } from "../../classes";
import type { ObjectFields } from "../get-obj-field-meta";
export declare function generateSubscriptionWhereType(node: Node, schemaComposer: SchemaComposer): InputTypeComposer;
export declare function generateSubscriptionConnectionWhereType({ node, schemaComposer, relationshipFields, interfaceCommonFields, }: {
    node: Node;
    schemaComposer: SchemaComposer;
    relationshipFields: Map<string, ObjectFields>;
    interfaceCommonFields: Map<string, ObjectFields>;
}): {
    created: InputTypeComposer;
    deleted: InputTypeComposer;
};
//# sourceMappingURL=generate-subscription-where-type.d.ts.map