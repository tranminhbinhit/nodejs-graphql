import { PropertyRef } from "./PropertyRef";
import { ListIndex } from "../expressions/list/ListIndex";
import type { CypherCompilable, Expr } from "../types";
import type { CypherEnvironment } from "../Environment";
/** Represents a reference that will be kept in the environment */
export declare abstract class Reference implements CypherCompilable {
    prefix: string;
    constructor(prefix?: string);
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
    /** Access individual property via the PropertyRef class, using the dot notation */
    property(path: string | Expr): PropertyRef;
    index(index: number): ListIndex;
}
export interface NamedReference extends Reference {
    readonly id: string;
}
//# sourceMappingURL=Reference.d.ts.map