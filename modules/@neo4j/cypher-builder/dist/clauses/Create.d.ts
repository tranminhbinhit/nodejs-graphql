import type { CypherEnvironment } from "../Environment";
import type { NodeRef } from "../references/NodeRef";
import type { Param } from "../references/Param";
import { Clause } from "./Clause";
import { WithReturn } from "./mixins/WithReturn";
import { WithSet } from "./mixins/WithSet";
type Params = Record<string, Param<any>>;
export interface Create extends WithReturn, WithSet {
}
/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/create/)
 * @group Clauses
 */
export declare class Create extends Clause {
    private pattern;
    constructor(node: NodeRef, params?: Params);
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
export {};
//# sourceMappingURL=Create.d.ts.map