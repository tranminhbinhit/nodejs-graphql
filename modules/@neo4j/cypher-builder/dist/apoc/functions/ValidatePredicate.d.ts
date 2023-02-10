import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { Predicate } from "../../types";
/**
 * @group Expressions
 * @category Cypher Functions
 */
export declare class ValidatePredicate extends CypherASTNode {
    private predicate;
    private message;
    constructor(predicate: Predicate, message: string);
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=ValidatePredicate.d.ts.map