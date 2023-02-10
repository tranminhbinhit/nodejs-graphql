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
exports.objectFieldsToUpdateInputFields = exports.objectFieldsToSubscriptionsWhereInputFields = exports.objectFieldsToCreateInputFields = exports.objectFieldsToComposeFields = exports.graphqlDirectivesToCompose = exports.graphqlArgsToCompose = void 0;
const get_field_type_meta_1 = __importDefault(require("./get-field-type-meta"));
const parse_value_node_1 = __importDefault(require("./parse-value-node"));
const numerical_1 = require("./resolvers/field/numerical");
const id_1 = require("./resolvers/field/id");
const constants_1 = require("./constants");
function graphqlArgsToCompose(args) {
    return args.reduce((res, arg) => {
        const meta = (0, get_field_type_meta_1.default)(arg.type);
        return {
            ...res,
            [arg.name.value]: {
                type: meta.pretty,
                description: arg.description,
                ...(arg.defaultValue ? { defaultValue: (0, parse_value_node_1.default)(arg.defaultValue) } : {}),
            },
        };
    }, {});
}
exports.graphqlArgsToCompose = graphqlArgsToCompose;
function graphqlDirectivesToCompose(directives) {
    return directives.map((directive) => ({
        args: (directive.arguments || [])?.reduce((r, d) => ({ ...r, [d.name.value]: (0, parse_value_node_1.default)(d.value) }), {}),
        name: directive.name.value,
    }));
}
exports.graphqlDirectivesToCompose = graphqlDirectivesToCompose;
function objectFieldsToComposeFields(fields) {
    return fields.reduce((res, field) => {
        if (field.writeonly) {
            return res;
        }
        const newField = {
            type: field.typeMeta.pretty,
            args: {},
            description: field.description,
        };
        if (field.otherDirectives.length) {
            newField.directives = graphqlDirectivesToCompose(field.otherDirectives);
        }
        if (["Int", "Float"].includes(field.typeMeta.name)) {
            newField.resolve = numerical_1.numericalResolver;
        }
        if (field.typeMeta.name === "ID") {
            newField.resolve = id_1.idResolver;
        }
        if (field.arguments) {
            newField.args = graphqlArgsToCompose(field.arguments);
        }
        return { ...res, [field.fieldName]: newField };
    }, {});
}
exports.objectFieldsToComposeFields = objectFieldsToComposeFields;
function objectFieldsToCreateInputFields(fields) {
    return fields
        .filter((f) => {
        const isAutogenerate = f?.autogenerate;
        const isCallback = f?.callback;
        const isTemporal = f?.timestamps;
        return !isAutogenerate && !isCallback && !isTemporal;
    })
        .reduce((res, f) => {
        const fieldType = f.typeMeta.input.create.pretty;
        const defaultValue = f?.defaultValue;
        const deprecatedDirectives = graphqlDirectivesToCompose(f.otherDirectives.filter((directive) => directive.name.value === "deprecated"));
        if (defaultValue !== undefined) {
            res[f.fieldName] = {
                type: fieldType,
                defaultValue,
                directives: deprecatedDirectives,
            };
        }
        else {
            res[f.fieldName] = {
                type: fieldType,
                directives: deprecatedDirectives,
            };
        }
        return res;
    }, {});
}
exports.objectFieldsToCreateInputFields = objectFieldsToCreateInputFields;
function objectFieldsToSubscriptionsWhereInputFields(typeName, fields) {
    return fields.reduce((res, f) => {
        const fieldType = f.typeMeta.input.where.pretty;
        const ifArrayOfAnyTypeExceptBoolean = f.typeMeta.array && f.typeMeta.name !== "Boolean";
        const ifAnyTypeExceptArrayAndBoolean = !f.typeMeta.array && f.typeMeta.name !== "Boolean";
        const isOneOfNumberTypes = ["Int", "Float", "BigInt"].includes(f.typeMeta.name) && !f.typeMeta.array;
        const isOneOfStringTypes = ["String", "ID"].includes(f.typeMeta.name) && !f.typeMeta.array;
        const isOneOfSpatialTypes = ["Point", "CartesianPoint"].includes(f.typeMeta.name);
        let inputTypeName = f.typeMeta.name;
        if (isOneOfSpatialTypes) {
            inputTypeName = `${inputTypeName}Input`;
        }
        return {
            ...res,
            AND: `[${typeName}SubscriptionWhere!]`,
            OR: `[${typeName}SubscriptionWhere!]`,
            NOT: `${typeName}SubscriptionWhere`,
            [f.fieldName]: fieldType,
            [`${f.fieldName}_NOT`]: {
                type: fieldType,
                directives: [
                    constants_1.DEPRECATE_NOT
                ],
            },
            ...(ifArrayOfAnyTypeExceptBoolean && {
                [`${f.fieldName}_INCLUDES`]: inputTypeName,
                [`${f.fieldName}_NOT_INCLUDES`]: {
                    type: inputTypeName,
                    directives: [
                        constants_1.DEPRECATE_NOT
                    ],
                },
            }),
            ...(ifAnyTypeExceptArrayAndBoolean && {
                [`${f.fieldName}_IN`]: `[${inputTypeName}]`,
                [`${f.fieldName}_NOT_IN`]: {
                    type: `[${inputTypeName}]`,
                    directives: [
                        constants_1.DEPRECATE_NOT
                    ],
                },
            }),
            ...(isOneOfNumberTypes && {
                [`${f.fieldName}_LT`]: fieldType,
                [`${f.fieldName}_LTE`]: fieldType,
                [`${f.fieldName}_GT`]: fieldType,
                [`${f.fieldName}_GTE`]: fieldType,
            }),
            ...(isOneOfStringTypes && {
                [`${f.fieldName}_STARTS_WITH`]: fieldType,
                [`${f.fieldName}_NOT_STARTS_WITH`]: {
                    type: fieldType,
                    directives: [
                        constants_1.DEPRECATE_NOT
                    ],
                },
                [`${f.fieldName}_ENDS_WITH`]: fieldType,
                [`${f.fieldName}_NOT_ENDS_WITH`]: {
                    type: fieldType,
                    directives: [
                        constants_1.DEPRECATE_NOT
                    ],
                },
                [`${f.fieldName}_CONTAINS`]: fieldType,
                [`${f.fieldName}_NOT_CONTAINS`]: {
                    type: fieldType,
                    directives: [
                        constants_1.DEPRECATE_NOT
                    ],
                },
            }),
        };
    }, {});
}
exports.objectFieldsToSubscriptionsWhereInputFields = objectFieldsToSubscriptionsWhereInputFields;
function objectFieldsToUpdateInputFields(fields) {
    return fields.reduce((res, f) => {
        const deprecatedDirectives = graphqlDirectivesToCompose(f.otherDirectives.filter((directive) => directive.name.value === "deprecated"));
        const staticField = f.readonly || f?.autogenerate;
        if (staticField) {
            return res;
        }
        const fieldType = f.typeMeta.input.update.pretty;
        res[f.fieldName] = {
            type: fieldType,
            directives: deprecatedDirectives,
        };
        return res;
    }, {});
}
exports.objectFieldsToUpdateInputFields = objectFieldsToUpdateInputFields;
//# sourceMappingURL=to-compose.js.map