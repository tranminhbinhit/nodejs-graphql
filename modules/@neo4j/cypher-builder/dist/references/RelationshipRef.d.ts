import type { NodeRef } from "./NodeRef";
import { MatchPatternOptions, Pattern } from "../Pattern";
import { Reference } from "./Reference";
export type RelationshipInput = {
    source: NodeRef;
    target: NodeRef;
    type?: string;
};
/** Reference to a relationship property
 * @group References
 */
export declare class RelationshipRef extends Reference {
    private _source;
    private _target;
    private _type;
    constructor(input: RelationshipInput);
    get source(): NodeRef;
    get target(): NodeRef;
    get type(): string | undefined;
    /** Sets the type of the relationship */
    withType(type: string): this;
    /** Reverses the direction of the relationship */
    reverse(): void;
    /** Creates a new Pattern from this relationship */
    pattern(options?: MatchPatternOptions): Pattern<RelationshipRef>;
}
//# sourceMappingURL=RelationshipRef.d.ts.map