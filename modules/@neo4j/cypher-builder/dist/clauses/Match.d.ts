import { MatchableElement, MatchParams, Pattern } from "../Pattern";
import { Clause } from "./Clause";
import { WithReturn } from "./mixins/WithReturn";
import { WithWhere } from "./mixins/WithWhere";
import { WithSet } from "./mixins/WithSet";
import { WithWith } from "./mixins/WithWith";
import { DeleteInput } from "./sub-clauses/Delete";
import type { PropertyRef } from "../references/PropertyRef";
import type { CypherEnvironment } from "../Environment";
export interface Match<T extends MatchableElement = any> extends WithReturn, WithWhere, WithSet, WithWith {
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/match/)
 * @group Clauses
 */
export declare class Match<T extends MatchableElement> extends Clause {
    private pattern;
    private deleteClause;
    private removeClause;
    private _optional;
    constructor(variable: T | Pattern<T>, parameters?: MatchParams<T>);
    /** Attach a DELETE subclause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/delete/)
     */
    delete(...deleteInput: DeleteInput): this;
    /** Attach a DETACH DELETE subclause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/delete/)
     */
    detachDelete(...deleteInput: DeleteInput): this;
    remove(...properties: PropertyRef[]): this;
    /** Makes the clause an OPTIONAL MATCH
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/)
     * @example
     * ```ts
     * new Cypher.Match(new Node({labels: ["Movie"]})).optional();
     * ```
     * _Cypher:_
     * ```cypher
     * OPTIONAL MATCH (this:Movie)
     * ```
     */
    optional(): this;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
    private createDeleteClause;
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/)
 * @group Clauses
 */
export declare class OptionalMatch<T extends MatchableElement = any> extends Match<T> {
    constructor(variable: T | Pattern<T>, parameters?: MatchParams<T>);
}
//# sourceMappingURL=Match.d.ts.map