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
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const constants_1 = require("../constants");
const create_auth_and_params_1 = require("./create-auth-and-params");
const create_datetime_element_1 = require("./projection/elements/create-datetime-element");
const translate_top_level_match_1 = require("./translate-top-level-match");
function translateAggregate({ node, context }) {
    const { fieldsByTypeName } = context.resolveTree;
    const varName = "this";
    let cypherParams = context.cypherParams ? { cypherParams: context.cypherParams } : {};
    const cypherStrs = [];
    const matchNode = new cypher_builder_1.default.NamedNode(varName, { labels: node.getLabels(context) });
    const topLevelMatch = (0, translate_top_level_match_1.translateTopLevelMatch)({ matchNode, node, context, operation: "READ" });
    cypherStrs.push(topLevelMatch.cypher);
    cypherParams = { ...cypherParams, ...topLevelMatch.params };
    const allowAuth = (0, create_auth_and_params_1.createAuthAndParams)({
        operations: "READ",
        entity: node,
        context,
        allow: {
            parentNode: node,
            varName,
        },
    });
    if (allowAuth[0]) {
        cypherStrs.push(`CALL apoc.util.validate(NOT (${allowAuth[0]}), "${constants_1.AUTH_FORBIDDEN_ERROR}", [0])`);
        cypherParams = { ...cypherParams, ...allowAuth[1] };
    }
    const selections = fieldsByTypeName[node.aggregateTypeNames.selection];
    const projections = [];
    const authStrs = [];
    // Do auth first so we can throw out before aggregating
    Object.entries(selections).forEach((selection) => {
        const authField = node.authableFields.find((x) => x.fieldName === selection[0]);
        if (authField) {
            if (authField.auth) {
                const allowAndParams = (0, create_auth_and_params_1.createAuthAndParams)({
                    entity: authField,
                    operations: "READ",
                    context,
                    allow: { parentNode: node, varName },
                });
                if (allowAndParams[0]) {
                    authStrs.push(allowAndParams[0]);
                    cypherParams = { ...cypherParams, ...allowAndParams[1] };
                }
            }
        }
    });
    if (authStrs.length) {
        cypherStrs.push(`CALL apoc.util.validate(NOT (${authStrs.join(" AND ")}), "${constants_1.AUTH_FORBIDDEN_ERROR}", [0])`);
    }
    Object.entries(selections).forEach((selection) => {
        if (selection[1].name === "count") {
            projections.push(`${selection[1].alias || selection[1].name}: count(${varName})`);
        }
        const primitiveField = node.primitiveFields.find((x) => x.fieldName === selection[1].name);
        const temporalField = node.temporalFields.find((x) => x.fieldName === selection[1].name);
        const field = primitiveField || temporalField;
        let isDateTime = false;
        const isString = primitiveField && primitiveField.typeMeta.name === "String";
        if (!primitiveField && temporalField && temporalField.typeMeta.name === "DateTime") {
            isDateTime = true;
        }
        if (field) {
            const thisProjections = [];
            const aggregateFields = selection[1].fieldsByTypeName[`${field.typeMeta.name}AggregateSelectionNullable`] ||
                selection[1].fieldsByTypeName[`${field.typeMeta.name}AggregateSelectionNonNullable`];
            Object.entries(aggregateFields).forEach((entry) => {
                // "min" | "max" | "average" | "sum" | "shortest" | "longest"
                let operator = entry[1].name;
                if (operator === "average") {
                    operator = "avg";
                }
                if (operator === "shortest") {
                    operator = "min";
                }
                if (operator === "longest") {
                    operator = "max";
                }
                const fieldName = field.dbPropertyName || field.fieldName;
                if (isDateTime) {
                    thisProjections.push((0, create_datetime_element_1.createDatetimeElement)({
                        resolveTree: entry[1],
                        field: field,
                        variable: varName,
                        valueOverride: `${operator}(this.${fieldName})`,
                    }));
                    return;
                }
                if (isString) {
                    const lessOrGreaterThan = entry[1].name === "shortest" ? "<" : ">";
                    const reduce = `
                            reduce(aggVar = collect(this.${fieldName})[0], current IN collect(this.${fieldName}) |
                                CASE
                                WHEN size(current) ${lessOrGreaterThan} size(aggVar) THEN current
                                ELSE aggVar
                                END
                            )
                        `;
                    thisProjections.push(`${entry[1].alias || entry[1].name}: ${reduce}`);
                    return;
                }
                thisProjections.push(`${entry[1].alias || entry[1].name}: ${operator}(this.${fieldName})`);
            });
            projections.push(`${selection[1].alias || selection[1].name}: { ${thisProjections.join(", ")} }`);
        }
    });
    cypherStrs.push(`RETURN { ${projections.join(", ")} }`);
    return [cypherStrs.filter(Boolean).join("\n"), cypherParams];
}
exports.default = translateAggregate;
//# sourceMappingURL=translate-aggregate.js.map