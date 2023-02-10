import type { CypherEnvironment } from "../Environment";
import type { NodeRef } from "../references/NodeRef";
import { Clause } from "../clauses/Clause";
import { WithReturn } from "../clauses/mixins/WithReturn";
import type { Variable } from "../references/Variable";
import type { Predicate } from "../types";
export interface FullTextQueryNodes extends WithReturn {
}
/**
 * @group Procedures
 */
export declare class FullTextQueryNodes extends Clause {
    private targetNode;
    private indexName;
    private phrase;
    private scoreVar;
    private whereClause;
    constructor(targetNode: NodeRef, indexName: string, phrase: Variable, scoreVar?: Variable, parent?: Clause);
    where(input: Predicate): this;
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=db.d.ts.map