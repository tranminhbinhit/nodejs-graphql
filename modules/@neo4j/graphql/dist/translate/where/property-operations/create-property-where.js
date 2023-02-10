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
exports.createPropertyWhere = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const classes_1 = require("../../../classes");
const utils_1 = require("../utils");
const map_to_db_property_1 = __importDefault(require("../../../utils/map-to-db-property"));
const create_global_node_operation_1 = require("./create-global-node-operation");
// Recursive function
const create_connection_operation_1 = require("./create-connection-operation");
const create_comparison_operation_1 = require("./create-comparison-operation");
// Recursive function
const create_relationship_operation_1 = require("./create-relationship-operation");
const create_aggregate_where_and_params_1 = require("../../create-aggregate-where-and-params");
/** Translates a property into its predicate filter */
function createPropertyWhere({ key, value, element, targetElement, context, listPredicateStr, requiredVariables, }) {
    const match = utils_1.whereRegEx.exec(key);
    if (!match) {
        throw new Error(`Failed to match key in filter: ${key}`);
    }
    const { prefix, fieldName, isAggregate, operator } = match?.groups;
    if (!fieldName) {
        throw new Error(`Failed to find field name in filter: ${key}`);
    }
    const isNot = operator?.startsWith("NOT") ?? false;
    const coalesceValue = [...element.primitiveFields, ...element.temporalFields, ...element.enumFields].find((f) => fieldName === f.fieldName)?.coalesceValue;
    let dbFieldName = (0, map_to_db_property_1.default)(element, fieldName);
    if (prefix) {
        dbFieldName = `${prefix}${dbFieldName}`;
    }
    let propertyRef = targetElement.property(dbFieldName);
    if (element instanceof classes_1.Node) {
        const node = element;
        if (node.isGlobalNode && key === "id") {
            return {
                predicate: (0, create_global_node_operation_1.createGlobalNodeOperation)({
                    node,
                    value,
                    targetElement,
                    coalesceValue,
                }),
                requiredVariables: [],
                aggregatingVariables: [],
            };
        }
        if (coalesceValue) {
            propertyRef = cypher_builder_1.default.coalesce(propertyRef, new cypher_builder_1.default.RawCypher(`${coalesceValue}`) // TODO: move into Cypher.literal
            );
        }
        const relationField = node.relationFields.find((x) => x.fieldName === fieldName);
        const relationTypeName = node.connectionFields.find((x) => x.relationship.fieldName === fieldName)?.relationshipTypeName;
        const relationship = context.relationships.find((x) => x.name === relationTypeName);
        if (isAggregate) {
            if (!relationField)
                throw new Error("Aggregate filters must be on relationship fields");
            return (0, create_aggregate_where_and_params_1.aggregatePreComputedWhereFields)(value, relationField, relationship, context, targetElement, listPredicateStr);
        }
        if (relationField) {
            return (0, create_relationship_operation_1.createRelationshipOperation)({
                relationField,
                context,
                parentNode: targetElement,
                operator,
                value,
                isNot,
                requiredVariables,
            });
        }
        const connectionField = node.connectionFields.find((x) => x.fieldName === fieldName);
        if (connectionField) {
            return (0, create_connection_operation_1.createConnectionOperation)({
                value,
                connectionField,
                context,
                parentNode: targetElement,
                operator,
                requiredVariables,
            });
        }
        if (value === null) {
            if (isNot) {
                return {
                    predicate: cypher_builder_1.default.isNotNull(propertyRef),
                    requiredVariables: [],
                    aggregatingVariables: [],
                };
            }
            return {
                predicate: cypher_builder_1.default.isNull(propertyRef),
                requiredVariables: [],
                aggregatingVariables: [],
            };
        }
    }
    const pointField = element.pointFields.find((x) => x.fieldName === fieldName);
    const durationField = element.primitiveFields.find((x) => x.fieldName === fieldName && x.typeMeta.name === "Duration");
    const comparisonOp = (0, create_comparison_operation_1.createComparisonOperation)({
        propertyRefOrCoalesce: propertyRef,
        param: new cypher_builder_1.default.Param(value),
        operator,
        durationField,
        pointField,
        neo4jDatabaseInfo: context.neo4jDatabaseInfo,
    });
    if (isNot) {
        return {
            predicate: cypher_builder_1.default.not(comparisonOp),
            requiredVariables: [],
            aggregatingVariables: [],
        };
    }
    return { predicate: comparisonOp, requiredVariables: [], aggregatingVariables: [] };
}
exports.createPropertyWhere = createPropertyWhere;
//# sourceMappingURL=create-property-where.js.map