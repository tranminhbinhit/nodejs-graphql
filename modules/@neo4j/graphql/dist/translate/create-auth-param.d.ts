import type { AuthContext, Context } from "../types";
type ContextAuthParams = Pick<Context, "jwt" | "plugins">;
declare function createAuthParam({ context }: {
    context: ContextAuthParams;
}): AuthContext;
export default createAuthParam;
//# sourceMappingURL=create-auth-param.d.ts.map