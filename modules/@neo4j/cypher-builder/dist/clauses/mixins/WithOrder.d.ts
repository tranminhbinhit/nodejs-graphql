import { Order, OrderBy } from "../sub-clauses/OrderBy";
import { ClauseMixin } from "./ClauseMixin";
import type { Expr } from "../../types";
import type { Param } from "../../references/Param";
import type { Literal } from "../../references/Literal";
import type { Integer } from "neo4j-driver";
export declare abstract class WithOrder extends ClauseMixin {
    protected orderByStatement: OrderBy | undefined;
    orderBy(...exprs: Array<[Expr, Order] | Expr | [Expr]>): this;
    skip(value: number | Param<Integer> | Literal<number>): this;
    limit(value: number | Param<Integer> | Literal<number>): this;
    private getOrCreateOrderBy;
}
//# sourceMappingURL=WithOrder.d.ts.map