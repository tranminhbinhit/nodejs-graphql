import type { RelationField } from "../types";
export type DirectionString = "-" | "->" | "<-";
export type RelationshipDirection = "IN" | "OUT" | "undirected";
type DirectionResult = {
    inStr: DirectionString;
    outStr: DirectionString;
};
export declare function getRelationshipDirection(relationField: RelationField, fieldArgs: {
    directed?: boolean;
}): RelationshipDirection;
export declare function getRelationshipDirectionStr(relationField: RelationField, fieldArgs: {
    directed?: boolean;
}): DirectionResult;
export {};
//# sourceMappingURL=get-relationship-direction.d.ts.map