import type { CypherEnvironment } from "../../Environment";
import { CypherASTNode } from "../../CypherASTNode";
import type { Expr } from "../../types";
import type { Param } from "../../references/Param";
import type { Literal } from "../../references/Literal";
import type { Integer } from "neo4j-driver";
export type Order = "ASC" | "DESC";
type OrderProjectionElement = [Expr, Order];
export declare class OrderBy extends CypherASTNode {
    private exprs;
    private skipClause;
    private limitClause;
    addOrderElements(exprs: OrderProjectionElement[]): void;
    skip(offset: number | Param<Integer> | Literal<number>): void;
    limit(limit: number | Param<Integer> | Literal<number>): void;
    private hasOrder;
    getCypher(env: CypherEnvironment): string;
}
export {};
//# sourceMappingURL=OrderBy.d.ts.map