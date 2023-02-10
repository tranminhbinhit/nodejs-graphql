import type { CypherEnvironment } from "../Environment";
import { Reference } from "./Reference";
/** Represents a parameter that will be passed as a separate object
 * @group References
 */
export declare class Param<T = any> extends Reference {
    readonly value: T;
    constructor(value: T);
    /** Defines if the Param has a value that needs to be returned by the builder */
    get hasValue(): boolean;
    getCypher(env: CypherEnvironment): string;
    get isNull(): boolean;
}
/** Represents a parameter with a given name
 * @group References
 */
export declare class NamedParam extends Param<any> {
    id: string;
    constructor(name: string, value?: any);
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=Param.d.ts.map