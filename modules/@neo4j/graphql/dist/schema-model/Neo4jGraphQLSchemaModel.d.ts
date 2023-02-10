import type { CompositeEntity } from "./entity/CompositeEntity";
import type { ConcreteEntity } from "./entity/ConcreteEntity";
import type { Entity } from "./entity/Entity";
/** Represents the internal model for the Neo4jGraphQL schema */
export declare class Neo4jGraphQLSchemaModel {
    entities: Map<string, Entity>;
    concreteEntities: ConcreteEntity[];
    compositeEntities: CompositeEntity[];
    constructor({ concreteEntities, compositeEntities, }: {
        concreteEntities: ConcreteEntity[];
        compositeEntities: CompositeEntity[];
    });
    getEntitiesByLabels(labels: string[]): ConcreteEntity[];
}
//# sourceMappingURL=Neo4jGraphQLSchemaModel.d.ts.map