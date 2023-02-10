import { CypherASTNode } from "../CypherASTNode";
import { EnvPrefix } from "../Environment";
import type { CypherResult } from "../types";
declare const customInspectSymbol: unique symbol;
/** Represents a clause AST node
 *  @group Internal
 */
export declare abstract class Clause extends CypherASTNode {
    /** Compiles a clause into Cypher and params */
    build(prefix?: string | EnvPrefix | undefined, extraParams?: Record<string, any>): CypherResult;
    private getEnv;
    /** Custom string for browsers and templating
     * @hidden
     */
    toString(): string;
    /** Custom log for console.log in Node
     * @hidden
     */
    [customInspectSymbol](): string;
}
export {};
//# sourceMappingURL=Clause.d.ts.map