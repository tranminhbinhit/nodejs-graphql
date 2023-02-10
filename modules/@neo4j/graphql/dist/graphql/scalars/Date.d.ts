import { GraphQLScalarType } from "graphql";
import { Date as Neo4jDate, Integer } from "neo4j-driver";
export declare const GraphQLDate: GraphQLScalarType<Neo4jDate<number> | Neo4jDate<Integer>, string>;
//# sourceMappingURL=Date.d.ts.map