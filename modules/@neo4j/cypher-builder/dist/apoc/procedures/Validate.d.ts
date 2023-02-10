import type { ListExpr as List } from "../../expressions/list/ListExpr";
import type { MapExpr as Map } from "../../expressions/map/MapExpr";
import type { CypherEnvironment } from "../../Environment";
import type { Predicate } from "../../types";
import { Literal } from "../../references/Literal";
import { CypherASTNode } from "../../CypherASTNode";
/**
 * @group Procedures
 */
export declare class Validate extends CypherASTNode {
    private predicate;
    private message;
    private params;
    constructor(predicate: Predicate, message: string, params?: List | Literal | Map);
    /**
     * @ignore
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=Validate.d.ts.map