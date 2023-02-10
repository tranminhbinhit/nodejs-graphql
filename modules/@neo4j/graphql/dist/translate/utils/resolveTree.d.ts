import type { ResolveTree } from "graphql-parse-resolve-info";
import type { BaseField } from "../../types";
/** Finds a resolve tree of selection based on field name */
export declare function getResolveTreeByFieldName({ fieldName, selection, }: {
    fieldName: string;
    selection: Record<string, ResolveTree>;
}): ResolveTree | undefined;
/** Finds an aliased resolve tree of selection based on field name */
export declare function getAliasedResolveTreeByFieldName({ fieldName, selection, }: {
    fieldName: string;
    selection: Record<string, ResolveTree>;
}): ResolveTree | undefined;
export declare function filterFieldsInSelection<T extends BaseField>({ fields, selection, }: {
    fields: T[];
    selection: Record<string, ResolveTree>;
}): T[];
/** Generates a field to be used in creating projections */
export declare function generateProjectionField({ name, alias, args, fieldsByTypeName, }: Pick<ResolveTree, "name"> & Partial<ResolveTree>): Record<string, ResolveTree>;
/** Generates missing fields based on an array of fieldNames */
export declare function generateMissingOrAliasedFields({ fieldNames, selection, }: {
    selection: Record<string, ResolveTree>;
    fieldNames: string[];
}): Record<string, ResolveTree>;
//# sourceMappingURL=resolveTree.d.ts.map