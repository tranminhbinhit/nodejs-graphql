import { ClauseMixin } from "./ClauseMixin";
import type { ProjectionColumn } from "../sub-clauses/Projection";
import { Unwind } from "../Unwind";
export declare abstract class WithUnwind extends ClauseMixin {
    protected unwindStatement: Unwind | undefined;
    unwind(...columns: Array<"*" | ProjectionColumn>): Unwind;
}
//# sourceMappingURL=WithUnwind.d.ts.map