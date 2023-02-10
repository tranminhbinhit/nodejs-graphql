import type { NodeRef } from "./references/NodeRef";
import type { RelationshipRef } from "./references/RelationshipRef";
import type { CypherEnvironment } from "./Environment";
import type { Param } from "./references/Param";
import type { CypherCompilable } from "./types";
export type MatchableElement = NodeRef | RelationshipRef;
type ItemOption = {
    labels?: boolean;
    variable?: boolean;
};
export type MatchPatternOptions = {
    source?: ItemOption;
    target?: ItemOption;
    relationship?: {
        type?: boolean;
        variable?: boolean;
    };
    directed?: boolean;
};
type ParamsRecord = Record<string, Param<any>>;
type MatchRelationshipParams = {
    source?: ParamsRecord;
    relationship?: ParamsRecord;
    target?: ParamsRecord;
};
export type MatchParams<T extends MatchableElement> = T extends NodeRef ? ParamsRecord : MatchRelationshipParams;
/** Represents a MATCH pattern
 * @group Other
 */
export declare class Pattern<T extends MatchableElement = MatchableElement> implements CypherCompilable {
    readonly matchElement: T;
    private parameters;
    private options;
    private reversed;
    constructor(input: T, options?: MatchPatternOptions);
    withParams(parameters: MatchParams<T>): this;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
    /** Reverses the pattern direction, not the underlying relationship */
    reverse(): void;
    private isRelationshipPattern;
    private getRelationshipCypher;
    private getRelationshipArrows;
    private isRelationship;
    private getNodeCypher;
    private serializeParameters;
    private getNodeLabelsString;
    private getRelationshipTypesString;
}
export {};
//# sourceMappingURL=Pattern.d.ts.map