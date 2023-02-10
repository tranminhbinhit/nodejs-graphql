import type { CypherEnvironment } from "../Environment";
import type { CypherCompilable, Expr } from "../types";
import type { Reference } from "./Reference";
import type { Variable } from "./Variable";
/** Reference to a variable property
 * @group References
 * @example new Node({labels: ["Movie"]}).property("title")
 */
export declare class PropertyRef implements CypherCompilable {
    private _variable;
    private propertyPath;
    constructor(variable: Reference, ...properties: Array<string | Expr>);
    get variable(): Variable;
    /** Access individual property via the PropertyRef class, using the dot notation */
    property(prop: string | Expr): PropertyRef;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
    private getPropertyCypher;
}
//# sourceMappingURL=PropertyRef.d.ts.map