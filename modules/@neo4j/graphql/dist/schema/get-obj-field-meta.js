"use strict";
/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const get_auth_1 = __importDefault(require("./get-auth"));
const get_alias_meta_1 = __importDefault(require("./get-alias-meta"));
const get_cypher_meta_1 = require("./get-cypher-meta");
const get_field_type_meta_1 = __importDefault(require("./get-field-type-meta"));
const get_custom_resolver_meta_1 = __importDefault(require("./get-custom-resolver-meta"));
const get_relationship_meta_1 = __importDefault(require("./get-relationship-meta"));
const get_unique_meta_1 = __importDefault(require("./parse/get-unique-meta"));
const constants_1 = require("../constants");
const parse_value_node_1 = __importDefault(require("./parse-value-node"));
const check_directive_combinations_1 = __importDefault(require("./check-directive-combinations"));
const upper_first_1 = require("../utils/upper-first");
const get_populated_by_meta_1 = require("./get-populated-by-meta");
const deprecationWarning = "The @callback directive has been deprecated and will be removed in version 4.0. Please use @populatedBy instead." +
    "More information can be found at " +
    "https://neo4j.com/docs/graphql-manual/current/guides/v4-migration/#_callback_renamed_to_populatedby.";
let callbackDeprecatedWarningShown = false;
function getObjFieldMeta({ obj, objects, interfaces, scalars, unions, enums, callbacks, customResolvers, validateResolvers, }) {
    const objInterfaceNames = [...(obj.interfaces || [])];
    const objInterfaces = interfaces.filter((i) => objInterfaceNames.map((n) => n.name.value).includes(i.name.value));
    return obj?.fields?.reduce((res, field) => {
        const interfaceField = objInterfaces
            .find((i) => i.fields?.map((f) => f.name.value).includes(field.name.value))
            ?.fields?.find((f) => f.name.value === field.name.value);
        // Create array of directives for this field. Field directives override interface field directives.
        const directives = [
            ...(field?.directives || []),
            ...(interfaceField?.directives || []).filter((d) => !field.directives?.find((fd) => fd.name.value === d.name.value)),
        ];
        (0, check_directive_combinations_1.default)(directives);
        if (directives.some((x) => x.name.value === "private")) {
            return res;
        }
        const relationshipMeta = (0, get_relationship_meta_1.default)(field, interfaceField);
        const cypherMeta = (0, get_cypher_meta_1.getCypherMeta)(field, interfaceField);
        const customResolverMeta = (0, get_custom_resolver_meta_1.default)(field, obj, validateResolvers, customResolvers, interfaceField);
        const typeMeta = (0, get_field_type_meta_1.default)(field.type);
        const authDirective = directives.find((x) => x.name.value === "auth");
        const idDirective = directives.find((x) => x.name.value === "id");
        const defaultDirective = directives.find((x) => x.name.value === "default");
        const coalesceDirective = directives.find((x) => x.name.value === "coalesce");
        const timestampDirective = directives.find((x) => x.name.value === "timestamp");
        const aliasDirective = directives.find((x) => x.name.value === "alias");
        const callbackDirective = directives.find((x) => x.name.value === "callback");
        const populatedByDirective = directives.find((x) => x.name.value === "populatedBy");
        const unique = (0, get_unique_meta_1.default)(directives, obj, field.name.value);
        const fieldInterface = interfaces.find((x) => x.name.value === typeMeta.name);
        const fieldUnion = unions.find((x) => x.name.value === typeMeta.name);
        const fieldScalar = scalars.find((x) => x.name.value === typeMeta.name);
        const fieldEnum = enums.find((x) => x.name.value === typeMeta.name);
        const fieldObject = objects.find((x) => x.name.value === typeMeta.name);
        const baseField = {
            fieldName: field.name.value,
            dbPropertyName: field.name.value,
            typeMeta,
            otherDirectives: (directives || []).filter((x) => ![
                "relationship",
                "cypher",
                "id",
                "auth",
                "readonly",
                "writeonly",
                "computed",
                "customResolver",
                "default",
                "coalesce",
                "timestamp",
                "alias",
                "unique",
                "callback",
                "populatedBy",
            ].includes(x.name.value)),
            arguments: [...(field.arguments || [])],
            ...(authDirective ? { auth: (0, get_auth_1.default)(authDirective) } : {}),
            description: field.description?.value,
            readonly: directives.some((d) => d.name.value === "readonly") ||
                interfaceField?.directives?.some((x) => x.name.value === "readonly"),
            writeonly: directives.some((d) => d.name.value === "writeonly") ||
                interfaceField?.directives?.some((x) => x.name.value === "writeonly"),
            ...(unique ? { unique } : {}),
        };
        if (aliasDirective) {
            const aliasMeta = (0, get_alias_meta_1.default)(aliasDirective);
            if (aliasMeta) {
                baseField.dbPropertyName = aliasMeta.property;
            }
        }
        if (relationshipMeta) {
            if (authDirective) {
                throw new Error("cannot have auth directive on a relationship");
            }
            if (defaultDirective) {
                throw new Error("@default directive can only be used on primitive type fields");
            }
            if (coalesceDirective) {
                throw new Error("@coalesce directive can only be used on primitive type fields");
            }
            if (aliasDirective) {
                throw new Error("@alias directive cannot be used on relationship fields");
            }
            const msg = `List type relationship fields must be non-nullable and have non-nullable entries, please change type of ${obj.name.value}.${field.name.value} to [${baseField.typeMeta.name}!]!`;
            if (typeMeta.originalType?.kind === "NonNullType") {
                if (typeMeta.originalType?.type.kind === "ListType") {
                    if (typeMeta.originalType?.type.type.kind !== "NonNullType") {
                        throw new Error(msg);
                    }
                }
            }
            else if (typeMeta.originalType?.kind === "ListType") {
                throw new Error(msg);
            }
            const relationField = {
                ...baseField,
                ...relationshipMeta,
                inherited: false,
            };
            if (fieldUnion) {
                const nodes = [];
                fieldUnion.types?.forEach((type) => {
                    nodes.push(type.name.value);
                });
                const unionField = {
                    ...baseField,
                    nodes,
                };
                relationField.union = unionField;
            }
            if (fieldInterface) {
                const implementations = objects
                    .filter((n) => n.interfaces?.some((i) => i.name.value === fieldInterface.name.value))
                    .map((n) => n.name.value);
                relationField.interface = {
                    ...baseField,
                    implementations,
                };
            }
            // TODO: This will be brittle if more than one interface
            let connectionPrefix = obj.name.value;
            if (obj.interfaces && obj.interfaces.length) {
                const inter = interfaces.find((i) => i.name.value === obj.interfaces[0].name.value);
                if (inter.fields?.some((f) => f.name.value === baseField.fieldName)) {
                    connectionPrefix = obj.interfaces[0].name.value;
                    relationField.inherited = true;
                }
            }
            relationField.connectionPrefix = connectionPrefix;
            const connectionTypeName = `${connectionPrefix}${(0, upper_first_1.upperFirst)(`${baseField.fieldName}Connection`)}`;
            const relationshipTypeName = `${connectionPrefix}${(0, upper_first_1.upperFirst)(`${baseField.fieldName}Relationship`)}`;
            const connectionField = {
                fieldName: `${baseField.fieldName}Connection`,
                relationshipTypeName,
                typeMeta: {
                    name: connectionTypeName,
                    required: true,
                    pretty: `${connectionTypeName}!`,
                    input: {
                        where: {
                            type: `${connectionTypeName}Where`,
                            pretty: `${connectionTypeName}Where`,
                        },
                        create: {
                            type: "",
                            pretty: "",
                        },
                        update: {
                            type: "",
                            pretty: "",
                        },
                    },
                },
                otherDirectives: baseField.otherDirectives,
                arguments: [...(field.arguments || [])],
                description: field.description?.value,
                relationship: relationField,
            };
            res.relationFields.push(relationField);
            res.connectionFields.push(connectionField);
            // }
        }
        else if (cypherMeta) {
            if (defaultDirective) {
                throw new Error("@default directive can only be used on primitive type fields");
            }
            if (coalesceDirective) {
                throw new Error("@coalesce directive can only be used on primitive type fields");
            }
            if (aliasDirective) {
                throw new Error("@alias directive cannot be used on cypher fields");
            }
            const cypherField = {
                ...baseField,
                ...cypherMeta,
                isEnum: !!fieldEnum,
                isScalar: !!fieldScalar || constants_1.SCALAR_TYPES.includes(typeMeta.name),
            };
            res.cypherFields.push(cypherField);
        }
        else if (customResolverMeta) {
            res.customResolverFields.push({ ...baseField, ...customResolverMeta });
        }
        else if (fieldScalar) {
            if (defaultDirective) {
                throw new Error("@default directive can only be used on primitive type fields");
            }
            const scalarField = {
                ...baseField,
            };
            res.scalarFields.push(scalarField);
        }
        else if (fieldEnum) {
            const enumField = {
                kind: "Enum",
                ...baseField,
            };
            if (defaultDirective) {
                const defaultValue = defaultDirective.arguments?.find((a) => a.name.value === "value")?.value;
                if (!defaultValue || !isEnumValue(defaultValue)) {
                    throw new Error("@default value on enum fields must be an enum value");
                }
                enumField.defaultValue = defaultValue.value;
            }
            if (coalesceDirective) {
                const coalesceValue = coalesceDirective.arguments?.find((a) => a.name.value === "value")?.value;
                if (!coalesceValue || !isEnumValue(coalesceValue)) {
                    throw new Error("@coalesce value on enum fields must be an enum value");
                }
                // TODO: avoid duplication with primitives
                enumField.coalesceValue = `"${coalesceValue.value}"`;
            }
            res.enumFields.push(enumField);
        }
        else if (fieldUnion) {
            if (defaultDirective) {
                throw new Error("@default directive can only be used on primitive type fields");
            }
            if (coalesceDirective) {
                throw new Error("@coalesce directive can only be used on primitive type fields");
            }
            const unionField = {
                ...baseField,
            };
            res.unionFields.push(unionField);
        }
        else if (fieldInterface) {
            if (defaultDirective) {
                throw new Error("@default directive can only be used on primitive type fields");
            }
            if (coalesceDirective) {
                throw new Error("@coalesce directive can only be used on primitive type fields");
            }
            res.interfaceFields.push({
                ...baseField,
            });
        }
        else if (fieldObject) {
            if (defaultDirective) {
                throw new Error("@default directive can only be used on primitive type fields");
            }
            if (coalesceDirective) {
                throw new Error("@coalesce directive can only be used on primitive type fields");
            }
            const objectField = {
                ...baseField,
            };
            res.objectFields.push(objectField);
        }
        else {
            if (["DateTime", "Date", "Time", "LocalDateTime", "LocalTime"].includes(typeMeta.name)) {
                const temporalField = {
                    ...baseField,
                };
                if (timestampDirective) {
                    if (baseField.typeMeta.array) {
                        throw new Error("cannot auto-generate an array");
                    }
                    if (!["DateTime", "Time"].includes(typeMeta.name)) {
                        throw new Error("Cannot timestamp temporal fields lacking time zone information");
                    }
                    const operations = timestampDirective?.arguments?.find((x) => x.name.value === "operations")
                        ?.value;
                    const timestamps = operations
                        ? operations?.values.map((x) => (0, parse_value_node_1.default)(x))
                        : ["CREATE", "UPDATE"];
                    temporalField.timestamps = timestamps;
                }
                if (defaultDirective) {
                    const value = defaultDirective.arguments?.find((a) => a.name.value === "value")?.value;
                    if (Number.isNaN(Date.parse(value.value))) {
                        throw new Error(`Default value for ${obj.name.value}.${temporalField.fieldName} is not a valid DateTime`);
                    }
                    temporalField.defaultValue = value.value;
                }
                if (coalesceDirective) {
                    throw new Error("@coalesce is not supported by DateTime fields at this time");
                }
                res.temporalFields.push(temporalField);
            }
            else if (["Point", "CartesianPoint"].includes(typeMeta.name)) {
                if (defaultDirective) {
                    throw new Error("@default directive can only be used on primitive type fields");
                }
                if (coalesceDirective) {
                    throw new Error("@coalesce directive can only be used on primitive type fields");
                }
                const pointField = {
                    ...baseField,
                };
                res.pointFields.push(pointField);
            }
            else {
                const primitiveField = {
                    ...baseField,
                };
                if (populatedByDirective) {
                    const callback = (0, get_populated_by_meta_1.getPopulatedByMeta)(populatedByDirective, callbacks);
                    primitiveField.callback = callback;
                }
                if (callbackDirective) {
                    if (!callbackDeprecatedWarningShown) {
                        console.warn(deprecationWarning);
                        callbackDeprecatedWarningShown = true;
                    }
                    const callback = (0, get_populated_by_meta_1.getCallbackMeta)(callbackDirective, callbacks);
                    primitiveField.callback = callback;
                }
                if (idDirective) {
                    const autogenerate = idDirective.arguments?.find((a) => a.name.value === "autogenerate");
                    if (!autogenerate || autogenerate.value.value) {
                        if (baseField.typeMeta.name !== "ID") {
                            throw new Error("cannot auto-generate a non ID field");
                        }
                        if (baseField.typeMeta.array) {
                            throw new Error("cannot auto-generate an array");
                        }
                        primitiveField.autogenerate = true;
                    }
                    const global = idDirective.arguments?.find((a) => a.name.value === "global");
                    if (global) {
                        primitiveField.isGlobalIdField = true;
                    }
                }
                if (defaultDirective) {
                    const value = defaultDirective.arguments?.find((a) => a.name.value === "value")?.value;
                    const checkKind = (kind) => {
                        if (value?.kind !== kind) {
                            throw new Error(`Default value for ${obj.name.value}.${primitiveField.fieldName} does not have matching type ${primitiveField.typeMeta.name}`);
                        }
                    };
                    switch (baseField.typeMeta.name) {
                        case "ID":
                        case "String":
                            checkKind(graphql_1.Kind.STRING);
                            primitiveField.defaultValue = value.value;
                            break;
                        case "Boolean":
                            checkKind(graphql_1.Kind.BOOLEAN);
                            primitiveField.defaultValue = value.value;
                            break;
                        case "Int":
                            checkKind(graphql_1.Kind.INT);
                            primitiveField.defaultValue = parseInt(value.value, 10);
                            break;
                        case "Float":
                            checkKind(graphql_1.Kind.FLOAT);
                            primitiveField.defaultValue = parseFloat(value.value);
                            break;
                        default:
                            throw new Error("@default directive can only be used on types: Int | Float | String | Boolean | ID | DateTime | Enum");
                    }
                }
                if (coalesceDirective) {
                    const value = coalesceDirective.arguments?.find((a) => a.name.value === "value")?.value;
                    const checkKind = (kind) => {
                        if (value?.kind !== kind) {
                            throw new Error(`coalesce() value for ${obj.name.value}.${primitiveField.fieldName} does not have matching type ${primitiveField.typeMeta.name}`);
                        }
                    };
                    switch (baseField.typeMeta.name) {
                        case "ID":
                        case "String":
                            checkKind(graphql_1.Kind.STRING);
                            primitiveField.coalesceValue = `"${value.value}"`;
                            break;
                        case "Boolean":
                            checkKind(graphql_1.Kind.BOOLEAN);
                            primitiveField.coalesceValue = value.value;
                            break;
                        case "Int":
                            checkKind(graphql_1.Kind.INT);
                            primitiveField.coalesceValue = parseInt(value.value, 10);
                            break;
                        case "Float":
                            checkKind(graphql_1.Kind.FLOAT);
                            primitiveField.coalesceValue = parseFloat(value.value);
                            break;
                        default:
                            throw new Error("@coalesce directive can only be used on types: Int | Float | String | Boolean | ID | DateTime");
                    }
                }
                res.primitiveFields.push(primitiveField);
            }
        }
        return res;
    }, {
        relationFields: [],
        connectionFields: [],
        primitiveFields: [],
        cypherFields: [],
        scalarFields: [],
        enumFields: [],
        unionFields: [],
        interfaceFields: [],
        objectFields: [],
        temporalFields: [],
        pointFields: [],
        customResolverFields: [],
    });
}
function isEnumValue(value) {
    return value.kind === graphql_1.Kind.ENUM;
}
exports.default = getObjFieldMeta;
//# sourceMappingURL=get-obj-field-meta.js.map