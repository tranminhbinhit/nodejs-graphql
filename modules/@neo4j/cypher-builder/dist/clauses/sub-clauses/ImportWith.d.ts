import type { Call } from "../Call";
import type { CypherEnvironment } from "../../Environment";
import type { PropertyRef } from "../../references/PropertyRef";
import type { Param } from "../../references/Param";
import type { Variable } from "../../references/Variable";
import { CypherASTNode } from "../../CypherASTNode";
export type SetParam = [PropertyRef, Param<any>];
/** Represents a WITH statement to import variables into a CALL subquery */
export declare class ImportWith extends CypherASTNode {
    private params;
    constructor(parent: Call, params?: Variable[]);
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=ImportWith.d.ts.map