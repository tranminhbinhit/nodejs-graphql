import type { DirectiveNode } from "graphql";
type AliasMeta = {
    property: string;
};
declare function getAliasMeta(directive: DirectiveNode): AliasMeta | undefined;
export default getAliasMeta;
//# sourceMappingURL=get-alias-meta.d.ts.map