import type { CypherEnvironment } from "./Environment";
import type { CypherCompilable } from "./types";
/** Abstract class representing a Cypher Statement in the AST
 * @hidden
 */
export declare abstract class CypherASTNode implements CypherCompilable {
    protected parent?: CypherASTNode;
    /**
     * @hidden
     */
    constructor(parent?: CypherASTNode);
    /**
     * @hidden
     */
    getRoot(): CypherASTNode;
    /** Concrete tree traversal pattern to generate the Cypher on nested nodes */
    abstract getCypher(env: CypherEnvironment): string;
    /** Sets the parent-child relationship for build traversal */
    protected addChildren(...nodes: CypherCompilable[]): void;
    protected setParent(node: CypherASTNode): void;
    protected get isRoot(): boolean;
}
//# sourceMappingURL=CypherASTNode.d.ts.map