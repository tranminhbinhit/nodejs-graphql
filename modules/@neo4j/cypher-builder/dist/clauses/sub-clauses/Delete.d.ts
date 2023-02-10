import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { NodeRef } from "../../references/NodeRef";
import type { RelationshipRef } from "../../references/RelationshipRef";
export type DeleteInput = Array<NodeRef | RelationshipRef>;
export declare class DeleteClause extends CypherASTNode {
    private deleteInput;
    private _detach;
    constructor(parent: CypherASTNode | undefined, deleteInput: DeleteInput);
    detach(): void;
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=Delete.d.ts.map