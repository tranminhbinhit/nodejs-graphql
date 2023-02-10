import type { CypherEnvironment } from "../../Environment";
import { SetClause, SetParam } from "./Set";
export type OnCreateParam = SetParam;
export declare class OnCreate extends SetClause {
    getCypher(env: CypherEnvironment): string;
}
//# sourceMappingURL=OnCreate.d.ts.map