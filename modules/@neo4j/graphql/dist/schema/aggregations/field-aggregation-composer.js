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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldAggregationComposer = exports.FieldAggregationSchemaTypes = void 0;
const numerical_1 = require("../resolvers/field/numerical");
const aggregation_types_mapper_1 = require("./aggregation-types-mapper");
var FieldAggregationSchemaTypes;
(function (FieldAggregationSchemaTypes) {
    FieldAggregationSchemaTypes["field"] = "AggregationSelection";
    FieldAggregationSchemaTypes["node"] = "NodeAggregateSelection";
    FieldAggregationSchemaTypes["edge"] = "EdgeAggregateSelection";
})(FieldAggregationSchemaTypes = exports.FieldAggregationSchemaTypes || (exports.FieldAggregationSchemaTypes = {}));
class FieldAggregationComposer {
    constructor(composer) {
        this.composer = composer;
        this.aggregationTypesMapper = new aggregation_types_mapper_1.AggregationTypesMapper(composer);
    }
    createAggregationTypeObject(baseTypeName, refNode, relFields) {
        let aggregateSelectionEdge;
        const aggregateSelectionNodeFields = this.getAggregationFields(refNode);
        const aggregateSelectionNodeName = `${baseTypeName}${FieldAggregationSchemaTypes.node}`;
        const aggregateSelectionNode = this.createAggregationField(aggregateSelectionNodeName, aggregateSelectionNodeFields);
        if (relFields) {
            const aggregateSelectionEdgeFields = this.getAggregationFields(relFields);
            const aggregateSelectionEdgeName = `${baseTypeName}${FieldAggregationSchemaTypes.edge}`;
            aggregateSelectionEdge = this.createAggregationField(aggregateSelectionEdgeName, aggregateSelectionEdgeFields);
        }
        return this.composer.createObjectTC({
            name: `${baseTypeName}${FieldAggregationSchemaTypes.field}`,
            fields: {
                count: {
                    type: "Int!",
                    resolve: numerical_1.numericalResolver,
                    args: {},
                },
                ...(aggregateSelectionNode ? { node: aggregateSelectionNode } : {}),
                ...(aggregateSelectionEdge ? { edge: aggregateSelectionEdge } : {}),
            },
        });
    }
    getAggregationFields(relFields) {
        return [...relFields.primitiveFields, ...relFields.temporalFields].reduce((res, field) => {
            if (field.typeMeta.array) {
                return res;
            }
            const objectTypeComposer = this.aggregationTypesMapper.getAggregationType({
                fieldName: field.typeMeta.name,
                nullable: !field.typeMeta.required,
            });
            if (!objectTypeComposer)
                return res;
            res[field.fieldName] = objectTypeComposer.NonNull;
            return res;
        }, {});
    }
    createAggregationField(name, fields) {
        if (Object.keys(fields).length > 0) {
            return this.composer.createObjectTC({
                name,
                fields: {
                    ...fields,
                },
            });
        }
        return undefined;
    }
}
exports.FieldAggregationComposer = FieldAggregationComposer;
//# sourceMappingURL=field-aggregation-composer.js.map