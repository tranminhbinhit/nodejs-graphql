import type { CypherEnvironment } from "../../Environment";
import { Clause } from "../Clause";
/** The result of multiple clauses concatenated with {@link concat}
 * @group Clauses
 */
export declare class CompositeClause extends Clause {
    private separator;
    private children;
    /**
     * @hidden
     */
    constructor(children: Array<Clause | undefined>, separator: string);
    concat(...clauses: Array<Clause | undefined>): this;
    get empty(): boolean;
    /**
     * @hidden
     */
    getCypher(env: CypherEnvironment): string;
}
/** Concatenates multiple {@link Clause | clauses} into a single clause
 * @group Clauses
 */
export declare function concat(...clauses: Array<Clause | undefined>): CompositeClause;
//# sourceMappingURL=concat.d.ts.map