export declare const AUTH_FORBIDDEN_ERROR = "@neo4j/graphql/FORBIDDEN";
export declare const AUTH_UNAUTHENTICATED_ERROR = "@neo4j/graphql/UNAUTHENTICATED";
export declare const MIN_VERSIONS: {
    majorMinor: string;
    neo4j: string;
}[];
export declare const REQUIRED_APOC_FUNCTIONS: string[];
export declare const REQUIRED_APOC_PROCEDURES: string[];
export declare const DEBUG_ALL: string;
export declare const DEBUG_AUTH: string;
export declare const DEBUG_GRAPHQL: string;
export declare const DEBUG_EXECUTE: string;
export declare const DEBUG_GENERATE: string;
export declare const RELATIONSHIP_REQUIREMENT_PREFIX = "@neo4j/graphql/RELATIONSHIP-REQUIRED";
export declare const RESERVED_TYPE_NAMES: {
    regex: RegExp;
    error: string;
}[];
export declare const RESERVED_INTERFACE_FIELDS: string[][];
export declare const SCALAR_TYPES: string[];
export declare const NODE_OR_EDGE_KEYS: string[];
export declare const LOGICAL_OPERATORS: readonly ["AND", "OR", "NOT"];
export declare const AGGREGATION_COMPARISON_OPERATORS: string[];
export declare const AGGREGATION_AGGREGATE_COUNT_OPERATORS: string[];
export declare const WHERE_AGGREGATION_AVERAGE_TYPES: string[];
export declare const WHERE_AGGREGATION_TYPES: string[];
export declare enum RelationshipQueryDirectionOption {
    DEFAULT_DIRECTED = "DEFAULT_DIRECTED",
    DEFAULT_UNDIRECTED = "DEFAULT_UNDIRECTED",
    DIRECTED_ONLY = "DIRECTED_ONLY",
    UNDIRECTED_ONLY = "UNDIRECTED_ONLY"
}
export declare const META_CYPHER_VARIABLE = "meta";
export declare const META_OLD_PROPS_CYPHER_VARIABLE = "oldProps";
export declare const DBMS_COMPONENTS_QUERY = "CALL dbms.components() YIELD versions, edition UNWIND versions AS version RETURN version, edition";
//# sourceMappingURL=constants.d.ts.map