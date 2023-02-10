import type { Attribute } from "../attribute/Attribute";
import type { Entity } from "./Entity";
export declare class ConcreteEntity implements Entity {
    readonly name: string;
    readonly labels: Set<string>;
    readonly attributes: Map<string, Attribute>;
    constructor({ name, labels, attributes }: {
        name: string;
        labels: string[];
        attributes?: Attribute[];
    });
    matchLabels(labels: string[]): boolean;
    private addAttribute;
    private setsAreEqual;
}
//# sourceMappingURL=ConcreteEntity.d.ts.map