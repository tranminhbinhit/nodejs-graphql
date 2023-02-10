import type { CypherEnvironment } from "../../Environment";
import { CypherASTNode } from "../../CypherASTNode";
import type { PropertyRef } from "../../references/PropertyRef";
import type { Variable } from "../../references/Variable";
export declare class ConvertFormat extends CypherASTNode {
    private temporalParam;
    private currentFormat;
    private convertTo;
    constructor(temporalParam: any, currentFormat: any, convertTo: any);
    getCypher(env: CypherEnvironment): string;
}
/**
 * @group Expressions
 * @category Cypher Functions
 */
export declare function convertFormat(temporalParam: Variable | PropertyRef, currentFormat: string, convertTo: string): ConvertFormat;
//# sourceMappingURL=convert-format.d.ts.map