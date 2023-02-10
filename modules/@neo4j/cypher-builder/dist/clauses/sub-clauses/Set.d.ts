import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { MapExpr } from "../../expressions/map/MapExpr";
import type { PropertyRef } from "../../references/PropertyRef";
import type { Expr } from "../../types";
import type { MapProjection } from "../../expressions/map/MapProjection";
export type SetParam = [PropertyRef, Exclude<Expr, MapExpr | MapProjection>];
export declare class SetClause extends CypherASTNode {
    protected params: SetParam[];
    constructor(parent: CypherASTNode, params?: SetParam[]);
    addParams(...params: SetParam[]): void;
    getCypher(env: CypherEnvironment): string;
    private composeParam;
}
//# sourceMappingURL=Set.d.ts.map