import type { ConvertFormat } from "./functions/convert-format";
import type { RunFirstColumn } from "./functions/RunFirstColumn";
import type { ValidatePredicate } from "./functions/ValidatePredicate";
import type { Validate } from "./procedures/Validate";
export type ApocPredicate = ValidatePredicate;
export type ApocFunction = ApocPredicate | RunFirstColumn | ConvertFormat;
export type ApocProcedure = Validate;
//# sourceMappingURL=types.d.ts.map