import type { CypherEnvironment } from "../../Environment";
import type { Expr } from "../../types";
import { CypherASTNode } from "../../CypherASTNode";
import type { Variable } from "../../references/Variable";
import type { Literal } from "../../references/Literal";
export type ProjectionColumn = Expr | [Expr, string | Variable | Literal];
export declare class Projection extends CypherASTNode {
    private columns;
    private isStar;
    constructor(columns: Array<"*" | ProjectionColumn>);
    addColumns(columns: Array<"*" | ProjectionColumn>): void;
    getCypher(env: CypherEnvironment): string;
    private serializeColumn;
}
//# sourceMappingURL=Projection.d.ts.map