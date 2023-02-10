import type { DirectiveNode, NamedTypeNode } from "graphql";
import type { Auth, ConnectionField, Context, CustomEnumField, CustomScalarField, CypherField, FullText, InterfaceField, ObjectField, PointField, PrimitiveField, RelationField, TemporalField, UnionField } from "../types";
import type Exclude from "./Exclude";
import type { GraphElementConstructor } from "./GraphElement";
import { GraphElement } from "./GraphElement";
import type { NodeDirective } from "./NodeDirective";
import type { DecodedGlobalId } from "../utils/global-ids";
import type { QueryOptionsDirective } from "./QueryOptionsDirective";
import { NodeAuth } from "./NodeAuth";
export interface NodeConstructor extends GraphElementConstructor {
    name: string;
    relationFields: RelationField[];
    connectionFields: ConnectionField[];
    cypherFields: CypherField[];
    primitiveFields: PrimitiveField[];
    scalarFields: CustomScalarField[];
    enumFields: CustomEnumField[];
    otherDirectives: DirectiveNode[];
    unionFields: UnionField[];
    interfaceFields: InterfaceField[];
    interfaces: NamedTypeNode[];
    objectFields: ObjectField[];
    temporalFields: TemporalField[];
    pointFields: PointField[];
    plural?: string;
    auth?: Auth;
    fulltextDirective?: FullText;
    exclude?: Exclude;
    nodeDirective?: NodeDirective;
    description?: string;
    queryOptionsDirective?: QueryOptionsDirective;
    isGlobalNode?: boolean;
    globalIdField?: string;
    globalIdFieldIsInt?: boolean;
}
type MutableField = PrimitiveField | CustomScalarField | CustomEnumField | UnionField | ObjectField | TemporalField | PointField | CypherField;
type AuthableField = PrimitiveField | CustomScalarField | CustomEnumField | UnionField | ObjectField | TemporalField | PointField | CypherField;
type ConstrainableField = PrimitiveField | CustomScalarField | CustomEnumField | TemporalField | PointField;
export type RootTypeFieldNames = {
    create: string;
    read: string;
    update: string;
    delete: string;
    aggregate: string;
    subscribe: {
        created: string;
        updated: string;
        deleted: string;
        relationship_created: string;
        relationship_deleted: string;
    };
};
export type FulltextTypeNames = {
    result: string;
    where: string;
    sort: string;
};
export type AggregateTypeNames = {
    selection: string;
    input: string;
};
export type MutationResponseTypeNames = {
    create: string;
    update: string;
};
export type SubscriptionEvents = {
    create: string;
    update: string;
    delete: string;
    create_relationship: string;
    delete_relationship: string;
};
declare class Node extends GraphElement {
    relationFields: RelationField[];
    connectionFields: ConnectionField[];
    cypherFields: CypherField[];
    otherDirectives: DirectiveNode[];
    unionFields: UnionField[];
    interfaceFields: InterfaceField[];
    interfaces: NamedTypeNode[];
    objectFields: ObjectField[];
    exclude?: Exclude;
    nodeDirective?: NodeDirective;
    fulltextDirective?: FullText;
    auth?: NodeAuth;
    description?: string;
    queryOptions?: QueryOptionsDirective;
    singular: string;
    plural: string;
    isGlobalNode: boolean | undefined;
    private _idField;
    private _idFieldIsInt?;
    constructor(input: NodeConstructor);
    get mutableFields(): MutableField[];
    /** Fields you can apply auth allow and bind to */
    get authableFields(): AuthableField[];
    get constrainableFields(): ConstrainableField[];
    get uniqueFields(): ConstrainableField[];
    private get pascalCaseSingular();
    private get pascalCasePlural();
    get rootTypeFieldNames(): RootTypeFieldNames;
    get fulltextTypeNames(): FulltextTypeNames;
    get aggregateTypeNames(): AggregateTypeNames;
    get mutationResponseTypeNames(): MutationResponseTypeNames;
    get subscriptionEventTypeNames(): SubscriptionEvents;
    get subscriptionEventPayloadFieldNames(): SubscriptionEvents;
    getLabelString(context: Context): string;
    getLabels(context: Context): string[];
    getMainLabel(): string;
    getAllLabels(): string[];
    getGlobalIdField(): string;
    toGlobalId(id: string): string;
    fromGlobalId(relayId: string): DecodedGlobalId;
    private generateSingular;
    private generatePlural;
    private leadingUnderscores;
}
export default Node;
//# sourceMappingURL=Node.d.ts.map