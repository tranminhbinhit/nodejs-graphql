import { NamedReference, Reference } from "./Reference";
/** Represents a variable
 * @group Internal
 */
export declare class Variable extends Reference {
    constructor();
}
/** For compatibility reasons, represents a plain string variable
 * @hidden
 */
export declare class NamedVariable extends Variable implements NamedReference {
    readonly id: string;
    constructor(name: string);
}
//# sourceMappingURL=Variable.d.ts.map