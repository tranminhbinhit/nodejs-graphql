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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_compose_1 = require("graphql-compose");
const pluralize_1 = __importDefault(require("pluralize"));
const validation_1 = require("./validation");
const cypher_1 = require("./resolvers/field/cypher");
const numerical_1 = require("./resolvers/field/numerical");
const aggregate_1 = require("./resolvers/query/aggregate");
const read_1 = require("./resolvers/query/read");
const root_connection_1 = require("./resolvers/query/root-connection");
const create_1 = require("./resolvers/mutation/create");
const delete_1 = require("./resolvers/mutation/delete");
const update_1 = require("./resolvers/mutation/update");
const aggregation_types_mapper_1 = require("./aggregations/aggregation-types-mapper");
const fulltext_1 = require("./augment/fulltext");
const constants = __importStar(require("../constants"));
const Scalars = __importStar(require("../graphql/scalars"));
const create_connection_fields_1 = __importDefault(require("./create-connection-fields"));
const create_relationship_fields_1 = __importDefault(require("./create-relationship-fields"));
const get_custom_resolvers_1 = __importDefault(require("./get-custom-resolvers"));
const get_obj_field_meta_1 = __importDefault(require("./get-obj-field-meta"));
const get_sortable_fields_1 = __importDefault(require("./get-sortable-fields"));
const to_compose_1 = require("./to-compose");
const get_unique_fields_1 = __importDefault(require("./get-unique-fields"));
const get_where_fields_1 = __importDefault(require("./get-where-fields"));
const upper_first_1 = require("../utils/upper-first");
const ensure_non_empty_input_1 = require("./ensure-non-empty-input");
const get_definition_nodes_1 = require("./get-definition-nodes");
const is_root_type_1 = require("../utils/is-root-type");
// GraphQL type imports
const CreateInfo_1 = require("../graphql/objects/CreateInfo");
const DeleteInfo_1 = require("../graphql/objects/DeleteInfo");
const UpdateInfo_1 = require("../graphql/objects/UpdateInfo");
const PageInfo_1 = require("../graphql/objects/PageInfo");
const SortDirection_1 = require("../graphql/enums/SortDirection");
const QueryOptions_1 = require("../graphql/input-objects/QueryOptions");
const Point_1 = require("../graphql/objects/Point");
const CartesianPoint_1 = require("../graphql/objects/CartesianPoint");
const PointInput_1 = require("../graphql/input-objects/PointInput");
const CartesianPointInput_1 = require("../graphql/input-objects/CartesianPointInput");
const PointDistance_1 = require("../graphql/input-objects/PointDistance");
const CartesianPointDistance_1 = require("../graphql/input-objects/CartesianPointDistance");
const get_nodes_1 = __importDefault(require("./get-nodes"));
const generate_subscription_types_1 = require("./subscriptions/generate-subscription-types");
const get_resolve_and_subscription_methods_1 = require("./get-resolve-and-subscription-methods");
const create_global_nodes_1 = require("./create-global-nodes");
const math_1 = require("./math");
const array_methods_1 = require("./array-methods");
const FloatWhere_1 = require("../graphql/input-objects/FloatWhere");
function makeAugmentedSchema(document, { features, enableRegex, validateTypeDefs, validateResolvers, generateSubscriptions, callbacks, userCustomResolvers, } = { validateTypeDefs: true, validateResolvers: true }) {
    if (validateTypeDefs) {
        (0, validation_1.validateDocument)(document);
    }
    const composer = new graphql_compose_1.SchemaComposer();
    let relationships = [];
    composer.createObjectTC(CreateInfo_1.CreateInfo);
    composer.createObjectTC(DeleteInfo_1.DeleteInfo);
    composer.createObjectTC(UpdateInfo_1.UpdateInfo);
    composer.createObjectTC(PageInfo_1.PageInfo);
    composer.createInputTC(QueryOptions_1.QueryOptions);
    const sortDirection = composer.createEnumTC(SortDirection_1.SortDirection);
    const aggregationTypesMapper = new aggregation_types_mapper_1.AggregationTypesMapper(composer);
    const customResolvers = (0, get_custom_resolvers_1.default)(document);
    const definitionNodes = (0, get_definition_nodes_1.getDefinitionNodes)(document);
    const { scalarTypes, objectTypes, enumTypes, inputObjectTypes, directives, unionTypes } = definitionNodes;
    let { interfaceTypes } = definitionNodes;
    const extraDefinitions = [
        ...enumTypes,
        ...scalarTypes,
        ...directives,
        ...inputObjectTypes,
        ...unionTypes,
        ...[
            customResolvers.customQuery,
            customResolvers.customMutation,
            customResolvers.customSubscription,
        ],
    ].filter(Boolean);
    Object.values(Scalars).forEach((scalar) => composer.addTypeDefs(`scalar ${scalar.name}`));
    if (extraDefinitions.length) {
        composer.addTypeDefs((0, graphql_1.print)({ kind: graphql_1.Kind.DOCUMENT, definitions: extraDefinitions }));
    }
    const getNodesResult = (0, get_nodes_1.default)(definitionNodes, { callbacks, userCustomResolvers, validateResolvers });
    const { nodes, relationshipPropertyInterfaceNames, interfaceRelationshipNames, floatWhereInTypeDefs } = getNodesResult;
    // graphql-compose will break if the Point and CartesianPoint types are created but not used,
    // because it will purge the unused types but leave behind orphaned field resolvers
    //
    // These are flags to check whether the types are used and then create them if they are
    let { pointInTypeDefs, cartesianPointInTypeDefs } = getNodesResult;
    const hasGlobalNodes = (0, create_global_nodes_1.addGlobalNodeFields)(nodes, composer);
    const relationshipProperties = interfaceTypes.filter((i) => relationshipPropertyInterfaceNames.has(i.name.value));
    const interfaceRelationships = interfaceTypes.filter((i) => interfaceRelationshipNames.has(i.name.value));
    interfaceTypes = interfaceTypes.filter((i) => !(relationshipPropertyInterfaceNames.has(i.name.value) || interfaceRelationshipNames.has(i.name.value)));
    const relationshipFields = new Map();
    const interfaceCommonFields = new Map();
    relationshipProperties.forEach((relationship) => {
        const authDirective = (relationship.directives || []).find((x) => x.name.value === "auth");
        if (authDirective) {
            throw new Error("Cannot have @auth directive on relationship properties interface");
        }
        relationship.fields?.forEach((field) => {
            constants.RESERVED_INTERFACE_FIELDS.forEach(([fieldName, message]) => {
                if (field.name.value === fieldName) {
                    throw new Error(message);
                }
            });
            const forbiddenDirectives = ["auth", "relationship", "cypher"];
            forbiddenDirectives.forEach((directive) => {
                const found = (field.directives || []).find((x) => x.name.value === directive);
                if (found) {
                    throw new Error(`Cannot have @${directive} directive on relationship property`);
                }
            });
        });
        const relFields = (0, get_obj_field_meta_1.default)({
            enums: enumTypes,
            interfaces: interfaceTypes,
            objects: objectTypes,
            scalars: scalarTypes,
            unions: unionTypes,
            obj: relationship,
            callbacks,
            validateResolvers,
        });
        if (!pointInTypeDefs) {
            pointInTypeDefs = relFields.pointFields.some((field) => field.typeMeta.name === "Point");
        }
        if (!cartesianPointInTypeDefs) {
            cartesianPointInTypeDefs = relFields.pointFields.some((field) => field.typeMeta.name === "CartesianPoint");
        }
        relationshipFields.set(relationship.name.value, relFields);
        const baseFields = Object.values(relFields);
        const objectComposeFields = (0, to_compose_1.objectFieldsToComposeFields)(baseFields.reduce((acc, x) => [...acc, ...x], []));
        const propertiesInterface = composer.createInterfaceTC({
            name: relationship.name.value,
            fields: objectComposeFields,
        });
        composer.createInputTC({
            name: `${relationship.name.value}Sort`,
            fields: propertiesInterface.getFieldNames().reduce((res, f) => {
                return { ...res, [f]: "SortDirection" };
            }, {}),
        });
        const relationshipUpdateITC = composer.createInputTC({
            name: `${relationship.name.value}UpdateInput`,
            fields: (0, to_compose_1.objectFieldsToUpdateInputFields)([
                ...relFields.primitiveFields.filter((field) => !field.autogenerate && !field.readonly && !field.callback),
                ...relFields.scalarFields,
                ...relFields.enumFields,
                ...relFields.temporalFields.filter((field) => !field.timestamps),
                ...relFields.pointFields,
            ]),
        });
        (0, math_1.addMathOperatorsToITC)(relationshipUpdateITC);
        (0, array_methods_1.addArrayMethodsToITC)(relationshipUpdateITC, relFields.primitiveFields);
        (0, array_methods_1.addArrayMethodsToITC)(relationshipUpdateITC, relFields.pointFields);
        const relationshipWhereFields = (0, get_where_fields_1.default)({
            typeName: relationship.name.value,
            fields: {
                scalarFields: relFields.scalarFields,
                enumFields: relFields.enumFields,
                temporalFields: relFields.temporalFields,
                pointFields: relFields.pointFields,
                primitiveFields: relFields.primitiveFields,
            },
            enableRegex,
            features,
        });
        composer.createInputTC({
            name: `${relationship.name.value}Where`,
            fields: relationshipWhereFields,
        });
        composer.createInputTC({
            name: `${relationship.name.value}CreateInput`,
            fields: (0, to_compose_1.objectFieldsToCreateInputFields)([
                ...relFields.primitiveFields.filter((field) => !field.autogenerate && !field.callback),
                ...relFields.scalarFields,
                ...relFields.enumFields,
                ...relFields.temporalFields,
                ...relFields.pointFields,
            ]),
        });
    });
    interfaceRelationships.forEach((interfaceRelationship) => {
        const implementations = objectTypes.filter((n) => n.interfaces?.some((i) => i.name.value === interfaceRelationship.name.value));
        const interfaceFields = (0, get_obj_field_meta_1.default)({
            enums: enumTypes,
            interfaces: [...interfaceTypes, ...interfaceRelationships],
            objects: objectTypes,
            scalars: scalarTypes,
            unions: unionTypes,
            obj: interfaceRelationship,
            callbacks,
            validateResolvers,
        });
        if (!pointInTypeDefs) {
            pointInTypeDefs = interfaceFields.pointFields.some((field) => field.typeMeta.name === "Point");
        }
        if (!cartesianPointInTypeDefs) {
            cartesianPointInTypeDefs = interfaceFields.pointFields.some((field) => field.typeMeta.name === "CartesianPoint");
        }
        const baseFields = Object.values(interfaceFields);
        const objectComposeFields = (0, to_compose_1.objectFieldsToComposeFields)(baseFields.reduce((acc, x) => [...acc, ...x], []));
        const composeInterface = composer.createInterfaceTC({
            name: interfaceRelationship.name.value,
            fields: objectComposeFields,
        });
        interfaceCommonFields.set(interfaceRelationship.name.value, interfaceFields);
        const interfaceOptionsInput = composer.getOrCreateITC(`${interfaceRelationship.name.value}Options`, (tc) => {
            tc.addFields({
                limit: "Int",
                offset: "Int",
            });
        });
        const interfaceSortableFields = (0, get_sortable_fields_1.default)(interfaceFields).reduce((res, f) => ({
            ...res,
            [f.fieldName]: {
                type: sortDirection.getTypeName(),
                directives: (0, to_compose_1.graphqlDirectivesToCompose)(f.otherDirectives.filter((directive) => directive.name.value === "deprecated")),
            },
        }), {});
        if (Object.keys(interfaceSortableFields).length) {
            const interfaceSortInput = composer.getOrCreateITC(`${interfaceRelationship.name.value}Sort`, (tc) => {
                tc.addFields(interfaceSortableFields);
                tc.setDescription(`Fields to sort ${(0, pluralize_1.default)(interfaceRelationship.name.value)} by. The order in which sorts are applied is not guaranteed when specifying many fields in one ${`${interfaceRelationship.name.value}Sort`} object.`);
            });
            interfaceOptionsInput.addFields({
                sort: {
                    description: `Specify one or more ${`${interfaceRelationship.name.value}Sort`} objects to sort ${(0, pluralize_1.default)(interfaceRelationship.name.value)} by. The sorts will be applied in the order in which they are arranged in the array.`,
                    type: interfaceSortInput.List,
                },
            });
        }
        const interfaceWhereFields = (0, get_where_fields_1.default)({
            typeName: interfaceRelationship.name.value,
            fields: {
                scalarFields: interfaceFields.scalarFields,
                enumFields: interfaceFields.enumFields,
                temporalFields: interfaceFields.temporalFields,
                pointFields: interfaceFields.pointFields,
                primitiveFields: interfaceFields.primitiveFields,
            },
            enableRegex,
            isInterface: true,
            features,
        });
        const [implementationsConnectInput, implementationsDeleteInput, implementationsDisconnectInput, implementationsUpdateInput, implementationsWhereInput,] = ["ConnectInput", "DeleteInput", "DisconnectInput", "UpdateInput", "Where"].map((suffix) => composer.createInputTC({
            name: `${interfaceRelationship.name.value}Implementations${suffix}`,
            fields: {},
        }));
        composer.createInputTC({
            name: `${interfaceRelationship.name.value}Where`,
            fields: { ...interfaceWhereFields, _on: implementationsWhereInput },
        });
        const interfaceCreateInput = composer.createInputTC(`${interfaceRelationship.name.value}CreateInput`);
        const interfaceRelationshipITC = composer.getOrCreateITC(`${interfaceRelationship.name.value}UpdateInput`, (tc) => {
            tc.addFields({
                ...(0, to_compose_1.objectFieldsToUpdateInputFields)([
                    ...interfaceFields.primitiveFields,
                    ...interfaceFields.scalarFields,
                    ...interfaceFields.enumFields,
                    ...interfaceFields.temporalFields.filter((field) => !field.timestamps),
                    ...interfaceFields.pointFields,
                ]),
                _on: implementationsUpdateInput,
            });
        });
        (0, math_1.addMathOperatorsToITC)(interfaceRelationshipITC);
        (0, create_relationship_fields_1.default)({
            relationshipFields: interfaceFields.relationFields,
            schemaComposer: composer,
            composeNode: composeInterface,
            sourceName: interfaceRelationship.name.value,
            nodes,
            relationshipPropertyFields: relationshipFields,
        });
        relationships = [
            ...relationships,
            ...(0, create_connection_fields_1.default)({
                connectionFields: interfaceFields.connectionFields,
                schemaComposer: composer,
                composeNode: composeInterface,
                nodes,
                relationshipPropertyFields: relationshipFields,
            }),
        ];
        implementations.forEach((implementation) => {
            const node = nodes.find((n) => n.name === implementation.name.value);
            implementationsWhereInput.addFields({
                [implementation.name.value]: {
                    type: `${implementation.name.value}Where`,
                },
            });
            if (node.relationFields.length) {
                implementationsConnectInput.addFields({
                    [implementation.name.value]: {
                        type: `[${implementation.name.value}ConnectInput!]`,
                    },
                });
                implementationsDeleteInput.addFields({
                    [implementation.name.value]: {
                        type: `[${implementation.name.value}DeleteInput!]`,
                    },
                });
                implementationsDisconnectInput.addFields({
                    [implementation.name.value]: {
                        type: `[${implementation.name.value}DisconnectInput!]`,
                    },
                });
            }
            interfaceCreateInput.addFields({
                [implementation.name.value]: {
                    type: `${implementation.name.value}CreateInput`,
                },
            });
            implementationsUpdateInput.addFields({
                [implementation.name.value]: {
                    type: `${implementation.name.value}UpdateInput`,
                },
            });
        });
        if (implementationsConnectInput.getFieldNames().length) {
            const interfaceConnectInput = composer.getOrCreateITC(`${interfaceRelationship.name.value}ConnectInput`, (tc) => {
                tc.addFields({ _on: implementationsConnectInput });
            });
            interfaceConnectInput.setField("_on", implementationsConnectInput);
        }
        if (implementationsDeleteInput.getFieldNames().length) {
            const interfaceDeleteInput = composer.getOrCreateITC(`${interfaceRelationship.name.value}DeleteInput`, (tc) => {
                tc.addFields({ _on: implementationsDeleteInput });
            });
            interfaceDeleteInput.setField("_on", implementationsDeleteInput);
        }
        if (implementationsDisconnectInput.getFieldNames().length) {
            const interfaceDisconnectInput = composer.getOrCreateITC(`${interfaceRelationship.name.value}DisconnectInput`, (tc) => {
                tc.addFields({ _on: implementationsDisconnectInput });
            });
            interfaceDisconnectInput.setField("_on", implementationsDisconnectInput);
        }
        (0, ensure_non_empty_input_1.ensureNonEmptyInput)(composer, `${interfaceRelationship.name.value}CreateInput`);
        (0, ensure_non_empty_input_1.ensureNonEmptyInput)(composer, `${interfaceRelationship.name.value}UpdateInput`);
        [
            implementationsConnectInput,
            implementationsDeleteInput,
            implementationsDisconnectInput,
            implementationsUpdateInput,
            implementationsWhereInput,
        ].forEach((c) => (0, ensure_non_empty_input_1.ensureNonEmptyInput)(composer, c));
    });
    if (pointInTypeDefs) {
        // Every field (apart from CRS) in Point needs a custom resolver
        // to deconstruct the point objects we fetch from the database
        composer.createObjectTC(Point_1.Point);
        composer.createInputTC(PointInput_1.PointInput);
        composer.createInputTC(PointDistance_1.PointDistance);
    }
    if (cartesianPointInTypeDefs) {
        // Every field (apart from CRS) in CartesianPoint needs a custom resolver
        // to deconstruct the point objects we fetch from the database
        composer.createObjectTC(CartesianPoint_1.CartesianPoint);
        composer.createInputTC(CartesianPointInput_1.CartesianPointInput);
        composer.createInputTC(CartesianPointDistance_1.CartesianPointDistance);
    }
    if (floatWhereInTypeDefs) {
        composer.createInputTC(FloatWhere_1.FloatWhere);
    }
    nodes.forEach((node) => {
        const nodeFields = (0, to_compose_1.objectFieldsToComposeFields)([
            ...node.primitiveFields,
            ...node.cypherFields,
            ...node.enumFields,
            ...node.scalarFields,
            ...node.interfaceFields,
            ...node.objectFields,
            ...node.unionFields,
            ...node.temporalFields,
            ...node.pointFields,
            ...node.customResolverFields,
        ]);
        const composeNode = composer.createObjectTC({
            name: node.name,
            fields: nodeFields,
            description: node.description,
            directives: (0, to_compose_1.graphqlDirectivesToCompose)(node.otherDirectives),
            interfaces: node.interfaces.map((x) => x.name.value),
        });
        if (node.isGlobalNode) {
            composeNode.setField("id", {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                resolve: (src) => {
                    const field = node.getGlobalIdField();
                    const value = src[field];
                    return node.toGlobalId(value.toString());
                },
            });
            composeNode.addInterface("Node");
        }
        const sortFields = (0, get_sortable_fields_1.default)(node).reduce((res, f) => ({
            ...res,
            [f.fieldName]: {
                type: sortDirection.getTypeName(),
                directives: (0, to_compose_1.graphqlDirectivesToCompose)(f.otherDirectives.filter((directive) => directive.name.value === "deprecated")),
            },
        }), {});
        const nodeSortTypeName = `${node.name}Sort`;
        if (Object.keys(sortFields).length) {
            const sortInput = composer.createInputTC({
                name: nodeSortTypeName,
                fields: sortFields,
                description: `Fields to sort ${(0, upper_first_1.upperFirst)(node.plural)} by. The order in which sorts are applied is not guaranteed when specifying many fields in one ${nodeSortTypeName} object.`,
            });
            composer.createInputTC({
                name: `${node.name}Options`,
                fields: {
                    sort: {
                        description: `Specify one or more ${nodeSortTypeName} objects to sort ${(0, upper_first_1.upperFirst)(node.plural)} by. The sorts will be applied in the order in which they are arranged in the array.`,
                        type: sortInput.NonNull.List,
                    },
                    limit: "Int",
                    offset: "Int",
                },
            });
        }
        else {
            composer.createInputTC({
                name: `${node.name}Options`,
                fields: { limit: "Int", offset: "Int" },
            });
        }
        const queryFields = (0, get_where_fields_1.default)({
            typeName: node.name,
            enableRegex,
            fields: {
                temporalFields: node.temporalFields,
                enumFields: node.enumFields,
                pointFields: node.pointFields,
                primitiveFields: node.primitiveFields,
                scalarFields: node.scalarFields,
            },
            features,
        });
        const countField = {
            type: "Int!",
            resolve: numerical_1.numericalResolver,
            args: {},
        };
        composer.createObjectTC({
            name: node.aggregateTypeNames.selection,
            fields: {
                count: countField,
                ...[...node.primitiveFields, ...node.temporalFields].reduce((res, field) => {
                    if (field.typeMeta.array) {
                        return res;
                    }
                    const objectTypeComposer = aggregationTypesMapper.getAggregationType({
                        fieldName: field.typeMeta.name,
                        nullable: !field.typeMeta.required,
                    });
                    if (!objectTypeComposer)
                        return res;
                    res[field.fieldName] = objectTypeComposer.NonNull;
                    return res;
                }, {}),
            },
        });
        const nodeWhereTypeName = `${node.name}Where`;
        composer.createInputTC({
            name: nodeWhereTypeName,
            fields: node.isGlobalNode ? { id: "ID", ...queryFields } : queryFields,
        });
        (0, fulltext_1.augmentFulltextSchema)(node, composer, nodeWhereTypeName, nodeSortTypeName);
        const uniqueFields = (0, get_unique_fields_1.default)(node);
        composer.createInputTC({
            name: `${node.name}UniqueWhere`,
            fields: uniqueFields,
        });
        composer.createInputTC({
            name: `${node.name}CreateInput`,
            fields: (0, to_compose_1.objectFieldsToCreateInputFields)([
                ...node.primitiveFields.filter((field) => !field.callback),
                ...node.scalarFields,
                ...node.enumFields,
                ...node.temporalFields,
                ...node.pointFields,
            ]),
        });
        const nodeUpdateITC = composer.createInputTC({
            name: `${node.name}UpdateInput`,
            fields: (0, to_compose_1.objectFieldsToUpdateInputFields)([
                ...node.primitiveFields.filter((field) => !field.callback),
                ...node.scalarFields,
                ...node.enumFields,
                ...node.temporalFields.filter((field) => !field.timestamps),
                ...node.pointFields,
            ]),
        });
        (0, math_1.addMathOperatorsToITC)(nodeUpdateITC);
        (0, array_methods_1.addArrayMethodsToITC)(nodeUpdateITC, node.mutableFields);
        const mutationResponseTypeNames = node.mutationResponseTypeNames;
        composer.createObjectTC({
            name: mutationResponseTypeNames.create,
            fields: {
                info: `CreateInfo!`,
                [node.plural]: `[${node.name}!]!`,
            },
        });
        composer.createObjectTC({
            name: mutationResponseTypeNames.update,
            fields: {
                info: `UpdateInfo!`,
                [node.plural]: `[${node.name}!]!`,
            },
        });
        (0, create_relationship_fields_1.default)({
            relationshipFields: node.relationFields,
            schemaComposer: composer,
            composeNode,
            sourceName: node.name,
            nodes,
            relationshipPropertyFields: relationshipFields,
        });
        relationships = [
            ...relationships,
            ...(0, create_connection_fields_1.default)({
                connectionFields: node.connectionFields,
                schemaComposer: composer,
                composeNode,
                nodes,
                relationshipPropertyFields: relationshipFields,
            }),
        ];
        (0, ensure_non_empty_input_1.ensureNonEmptyInput)(composer, `${node.name}UpdateInput`);
        (0, ensure_non_empty_input_1.ensureNonEmptyInput)(composer, `${node.name}CreateInput`);
        const rootTypeFieldNames = node.rootTypeFieldNames;
        if (!node.exclude?.operations.includes("read")) {
            composer.Query.addFields({
                [rootTypeFieldNames.read]: (0, read_1.findResolver)({ node }),
            });
            composer.Query.addFields({
                [rootTypeFieldNames.aggregate]: (0, aggregate_1.aggregateResolver)({ node }),
            });
            composer.Query.addFields({
                [`${node.plural}Connection`]: (0, root_connection_1.rootConnectionResolver)({ node, composer }),
            });
        }
        if (!node.exclude?.operations.includes("create")) {
            composer.Mutation.addFields({
                [rootTypeFieldNames.create]: (0, create_1.createResolver)({ node }),
            });
        }
        if (!node.exclude?.operations.includes("delete")) {
            composer.Mutation.addFields({
                [rootTypeFieldNames.delete]: (0, delete_1.deleteResolver)({ node }),
            });
        }
        if (!node.exclude?.operations.includes("update")) {
            composer.Mutation.addFields({
                [rootTypeFieldNames.update]: (0, update_1.updateResolver)({
                    node,
                    schemaComposer: composer,
                }),
            });
        }
    });
    unionTypes.forEach((union) => {
        if (!union.types) {
            throw new Error(`Union ${union.name.value} has no types`);
        }
        const fields = union.types.reduce((f, type) => {
            return { ...f, [type.name.value]: `${type.name.value}Where` };
        }, {});
        composer.createInputTC({
            name: `${union.name.value}Where`,
            fields,
        });
    });
    if (generateSubscriptions) {
        (0, generate_subscription_types_1.generateSubscriptionTypes)({ schemaComposer: composer, nodes, relationshipFields, interfaceCommonFields });
    }
    ["Mutation", "Query"].forEach((type) => {
        const objectComposer = composer[type];
        const cypherType = customResolvers[`customCypher${type}`];
        if (cypherType) {
            const objectFields = (0, get_obj_field_meta_1.default)({
                obj: cypherType,
                scalars: scalarTypes,
                enums: enumTypes,
                interfaces: interfaceTypes,
                unions: unionTypes,
                objects: objectTypes,
                callbacks,
                validateResolvers,
            });
            const objectComposeFields = (0, to_compose_1.objectFieldsToComposeFields)([
                ...objectFields.enumFields,
                ...objectFields.interfaceFields,
                ...objectFields.primitiveFields,
                ...objectFields.relationFields,
                ...objectFields.scalarFields,
                ...objectFields.unionFields,
                ...objectFields.objectFields,
                ...objectFields.temporalFields,
            ]);
            objectComposer.addFields(objectComposeFields);
            objectFields.cypherFields.forEach((field) => {
                const customResolver = (0, cypher_1.cypherResolver)({
                    field,
                    statement: field.statement,
                    type: type,
                });
                const composedField = (0, to_compose_1.objectFieldsToComposeFields)([field])[field.fieldName];
                objectComposer.addFields({ [field.fieldName]: { ...composedField, ...customResolver } });
            });
        }
    });
    interfaceTypes.forEach((inter) => {
        const objectFields = (0, get_obj_field_meta_1.default)({
            obj: inter,
            scalars: scalarTypes,
            enums: enumTypes,
            interfaces: interfaceTypes,
            unions: unionTypes,
            objects: objectTypes,
            callbacks,
            validateResolvers,
        });
        const baseFields = Object.values(objectFields);
        const objectComposeFields = (0, to_compose_1.objectFieldsToComposeFields)(baseFields.reduce((acc, x) => [...acc, ...x], []));
        composer.createInterfaceTC({
            name: inter.name.value,
            description: inter.description?.value,
            fields: objectComposeFields,
            directives: (0, to_compose_1.graphqlDirectivesToCompose)((inter.directives || []).filter((x) => !["auth", "exclude"].includes(x.name.value))),
        });
    });
    if (!Object.values(composer.Mutation.getFields()).length) {
        composer.delete("Mutation");
    }
    const generatedTypeDefs = composer.toSDL();
    let parsedDoc = (0, graphql_1.parse)(generatedTypeDefs);
    function definionNodeHasName(x) {
        return "name" in x;
    }
    const emptyObjectsInterfaces = parsedDoc.definitions.filter((x) => (x.kind === "ObjectTypeDefinition" && !(0, is_root_type_1.isRootType)(x)) || x.kind === "InterfaceTypeDefinition").filter((x) => !x.fields?.length);
    if (emptyObjectsInterfaces.length) {
        throw new Error(`Objects and Interfaces must have one or more fields: ${emptyObjectsInterfaces
            .map((x) => x.name.value)
            .join(", ")}`);
    }
    const documentNames = new Set(parsedDoc.definitions.filter(definionNodeHasName).map((x) => x.name.value));
    const resolveMethods = (0, get_resolve_and_subscription_methods_1.getResolveAndSubscriptionMethods)(composer);
    const generatedResolveMethods = {};
    for (const [key, value] of Object.entries(resolveMethods)) {
        if (documentNames.has(key)) {
            generatedResolveMethods[key] = value;
        }
    }
    const generatedResolvers = {
        ...generatedResolveMethods,
        ...Object.values(Scalars).reduce((res, scalar) => {
            if (generatedTypeDefs.includes(`scalar ${scalar.name}\n`)) {
                res[scalar.name] = scalar;
            }
            return res;
        }, {}),
        ...(hasGlobalNodes ? { Node: { __resolveType: (root) => root.__resolveType } } : {}),
    };
    unionTypes.forEach((union) => {
        if (!generatedResolvers[union.name.value]) {
            generatedResolvers[union.name.value] = { __resolveType: (root) => root.__resolveType };
        }
    });
    interfaceRelationships.forEach((i) => {
        if (!generatedResolvers[i.name.value]) {
            generatedResolvers[i.name.value] = { __resolveType: (root) => root.__resolveType };
        }
    });
    const seen = {};
    parsedDoc = {
        ...parsedDoc,
        definitions: parsedDoc.definitions.filter((definition) => {
            if (!("name" in definition)) {
                return true;
            }
            const n = definition.name?.value;
            if (seen[n]) {
                return false;
            }
            seen[n] = n;
            return true;
        }),
    };
    return {
        nodes,
        relationships,
        typeDefs: parsedDoc,
        resolvers: generatedResolvers,
    };
}
exports.default = makeAugmentedSchema;
//# sourceMappingURL=make-augmented-schema.js.map