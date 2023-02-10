import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { PropertyRef } from "../../references/PropertyRef";
export type RemoveInput = Array<PropertyRef>;
export declare class RemoveClause extends CypherASTNode {
    private removeInput;
    constructor(parent: CypherASTNode | undefined, removeInput: RemoveInput);
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=Remove.d.ts.map