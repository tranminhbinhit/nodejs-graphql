import { HasLabel } from "../expressions/HasLabel";
import { MatchPatternOptions, Pattern } from "../Pattern";
import { NamedReference, Reference } from "./Reference";
import { RelationshipRef } from "./RelationshipRef";
type NodeRefOptions = {
    labels?: string[];
};
/** Represents a node reference
 * @group References
 */
export declare class NodeRef extends Reference {
    labels: string[];
    constructor(options?: NodeRefOptions);
    relatedTo(node: NodeRef): RelationshipRef;
    hasLabels(...labels: string[]): HasLabel;
    hasLabel(label: string): HasLabel;
    /** Creates a new Pattern from this node */
    pattern(options?: Pick<MatchPatternOptions, "source">): Pattern<NodeRef>;
}
/** Represents a node reference with a given name
 * @group References
 */
export declare class NamedNode extends NodeRef implements NamedReference {
    readonly id: string;
    constructor(id: string, options?: NodeRefOptions);
    get name(): string;
}
export {};
//# sourceMappingURL=NodeRef.d.ts.map