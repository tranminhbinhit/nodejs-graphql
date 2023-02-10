import type { CypherEnvironment } from "../Environment";
import type { RelationshipRef } from "../references/RelationshipRef";
import { NodeRef } from "../references/NodeRef";
import { MatchParams } from "../Pattern";
import { Clause } from "./Clause";
import { OnCreateParam } from "./sub-clauses/OnCreate";
import { WithReturn } from "./mixins/WithReturn";
import { WithSet } from "./mixins/WithSet";
export interface Merge extends WithReturn, WithSet {
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/merge/)
 * @group Clauses
 */
export declare class Merge<T extends NodeRef | RelationshipRef = any> extends Clause {
    private pattern;
    private onCreateClause;
    constructor(element: T, params?: MatchParams<T>);
    onCreate(...onCreateParams: OnCreateParam[]): this;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=Merge.d.ts.map