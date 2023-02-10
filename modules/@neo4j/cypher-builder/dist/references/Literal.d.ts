import type { CypherCompilable } from "../types";
type LiteralValue = string | number | boolean | null | Array<LiteralValue>;
/** Represents a literal value
 * @group References
 */
export declare class Literal<T extends LiteralValue = any> implements CypherCompilable {
    value: T;
    constructor(value: T);
    getCypher(): string;
    private formatLiteralValue;
}
/** Represents a `NULL` literal value
 * @group References
 */
export declare const CypherNull: Literal<null>;
export {};
//# sourceMappingURL=Literal.d.ts.map