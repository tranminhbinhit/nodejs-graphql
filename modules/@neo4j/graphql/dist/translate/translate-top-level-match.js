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
exports.createMatchClause = exports.translateTopLevelMatch = void 0;
const create_auth_and_params_1 = require("./create-auth-and-params");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_where_predicate_1 = require("./where/create-where-predicate");
const fulltext_1 = require("../graphql/directives/fulltext");
function translateTopLevelMatch({ matchNode, node, context, operation, }) {
    const { matchClause, preComputedWhereFieldSubqueries, whereClause } = createMatchClause({
        matchNode,
        node,
        context,
        operation,
    });
    if (preComputedWhereFieldSubqueries && !preComputedWhereFieldSubqueries.empty) {
        return cypher_builder_1.default.concat(matchClause, preComputedWhereFieldSubqueries, whereClause).build();
    }
    return matchClause.build();
}
exports.translateTopLevelMatch = translateTopLevelMatch;
function createMatchClause({ matchNode, node, context, operation, }) {
    const { resolveTree } = context;
    const fulltextInput = (resolveTree.args.fulltext || {});
    let matchClause = new cypher_builder_1.default.Match(matchNode);
    let whereInput = resolveTree.args.where;
    let whereOperators = [];
    // TODO: removed deprecated fulltext translation
    if (Object.entries(fulltextInput).length) {
        if (Object.entries(fulltextInput).length > 1) {
            throw new Error("Can only call one search at any given time");
        }
        const [indexName, indexInput] = Object.entries(fulltextInput)[0];
        const phraseParam = new cypher_builder_1.default.Param(indexInput.phrase);
        matchClause = new cypher_builder_1.default.db.FullTextQueryNodes(matchNode, indexName, phraseParam);
        whereOperators = node.getLabels(context).map((label) => {
            return cypher_builder_1.default.in(new cypher_builder_1.default.Literal(label), cypher_builder_1.default.labels(matchNode));
        });
    }
    else if (context.fulltextIndex) {
        ({ matchClause, whereOperators } = createFulltextMatchClause(matchNode, whereInput, node, context));
        whereInput = whereInput?.[node.singular];
    }
    let whereClause = matchClause;
    let preComputedWhereFieldSubqueries;
    if (whereInput) {
        const { predicate: whereOp, preComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
            targetElement: matchNode,
            whereInput,
            context,
            element: node,
        });
        preComputedWhereFieldSubqueries = preComputedSubqueries;
        whereClause =
            preComputedWhereFieldSubqueries && !preComputedWhereFieldSubqueries.empty
                ? new cypher_builder_1.default.With("*")
                : matchClause;
        if (whereOp)
            whereClause.where(whereOp);
    }
    if (whereOperators && whereOperators.length) {
        const andChecks = cypher_builder_1.default.and(...whereOperators);
        whereClause.where(andChecks);
    }
    const whereAuth = (0, create_auth_and_params_1.createAuthAndParams)({
        operations: operation,
        entity: node,
        context,
        where: { varName: matchNode, node },
    });
    if (whereAuth[0]) {
        const authQuery = new cypher_builder_1.default.RawCypher(() => {
            return whereAuth;
        });
        whereClause.where(authQuery);
    }
    return {
        matchClause,
        preComputedWhereFieldSubqueries,
        whereClause,
    };
}
exports.createMatchClause = createMatchClause;
function createFulltextMatchClause(matchNode, whereInput, node, context) {
    // TODO: remove indexName assignment and undefined check once the name argument has been removed.
    const indexName = context.fulltextIndex.indexName || context.fulltextIndex.name;
    if (indexName === undefined) {
        throw new Error("The name of the fulltext index should be defined using the indexName argument.");
    }
    const phraseParam = new cypher_builder_1.default.Param(context.resolveTree.args.phrase);
    const scoreVar = context.fulltextIndex.scoreVariable;
    const matchClause = new cypher_builder_1.default.db.FullTextQueryNodes(matchNode, indexName, phraseParam, scoreVar);
    const expectedLabels = node.getLabels(context);
    const labelsChecks = matchNode.hasLabels(...expectedLabels);
    const whereOperators = [];
    if (whereInput?.[fulltext_1.SCORE_FIELD]) {
        if (whereInput[fulltext_1.SCORE_FIELD].min || whereInput[fulltext_1.SCORE_FIELD].min === 0) {
            const scoreMinOp = cypher_builder_1.default.gte(scoreVar, new cypher_builder_1.default.Param(whereInput[fulltext_1.SCORE_FIELD].min));
            if (scoreMinOp)
                whereOperators.push(scoreMinOp);
        }
        if (whereInput[fulltext_1.SCORE_FIELD].max || whereInput[fulltext_1.SCORE_FIELD].max === 0) {
            const scoreMaxOp = cypher_builder_1.default.lte(scoreVar, new cypher_builder_1.default.Param(whereInput[fulltext_1.SCORE_FIELD].max));
            if (scoreMaxOp)
                whereOperators.push(scoreMaxOp);
        }
    }
    if (labelsChecks)
        whereOperators.push(labelsChecks);
    return {
        matchClause,
        whereOperators,
    };
}
//# sourceMappingURL=translate-top-level-match.js.map