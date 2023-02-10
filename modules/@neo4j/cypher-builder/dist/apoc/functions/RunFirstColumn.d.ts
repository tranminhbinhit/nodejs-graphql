import { CypherASTNode } from "../../CypherASTNode";
import type { Clause } from "../../clauses/Clause";
import type { Variable } from "../../references/Variable";
import type { CypherEnvironment } from "../../Environment";
import type { MapExpr } from "../../expressions/map/MapExpr";
/**
 * @group Expressions
 * @category Cypher Functions
 */
export declare class RunFirstColumn extends CypherASTNode {
    private innerClause;
    private variables;
    private expectMultipleValues;
    constructor(clause: Clause | string, variables?: Variable[] | MapExpr, expectMultipleValues?: boolean);
    getCypher(env: CypherEnvironment): string;
    private escapeQuery;
    private convertArrayToParams;
}
//# sourceMappingURL=RunFirstColumn.d.ts.map