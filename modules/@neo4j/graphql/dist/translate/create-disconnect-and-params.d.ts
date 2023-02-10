import type { Node } from "../classes";
import type { RelationField, Context } from "../types";
declare function createDisconnectAndParams({ withVars, value, varName, relationField, parentVar, refNodes, context, labelOverride, parentNode, insideDoWhen, parameterPrefix, isFirstLevel, }: {
    withVars: string[];
    value: any;
    varName: string;
    relationField: RelationField;
    parentVar: string;
    context: Context;
    refNodes: Node[];
    labelOverride?: string;
    parentNode: Node;
    insideDoWhen?: boolean;
    parameterPrefix: string;
    isFirstLevel?: boolean;
}): [string, any];
export default createDisconnectAndParams;
//# sourceMappingURL=create-disconnect-and-params.d.ts.map