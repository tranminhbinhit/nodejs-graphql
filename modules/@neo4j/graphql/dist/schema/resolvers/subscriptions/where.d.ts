import type { SubscriptionsEvent } from "../../../types";
import type Node from "../../../classes/Node";
import { RecordType, RelationshipType } from "./utils/compare-properties";
import type { ObjectFields } from "../../../schema/get-obj-field-meta";
export declare function subscriptionWhere({ where, event, node, nodes, relationshipFields, }: {
    where: Record<string, RecordType | RelationshipType> | undefined;
    event: SubscriptionsEvent;
    node: Node;
    nodes?: Node[];
    relationshipFields?: Map<string, ObjectFields>;
}): boolean;
//# sourceMappingURL=where.d.ts.map