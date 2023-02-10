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
exports.createAuthPredicates = exports.createAuthAndParams = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const classes_1 = require("../classes");
const join_predicates_1 = require("../utils/join-predicates");
const context_parser_1 = __importDefault(require("../utils/context-parser"));
const utils_1 = require("../utils/utils");
const NodeAuth_1 = require("../classes/NodeAuth");
const map_to_db_property_1 = __importDefault(require("../utils/map-to-db-property"));
const constants_1 = require("../constants");
const get_or_create_cypher_variable_1 = require("./utils/get-or-create-cypher-variable");
function createAuthAndParams({ entity, operations, skipRoles, skipIsAuthenticated, allow, context, escapeQuotes, bind, where, }) {
    const authPredicate = createAuthPredicates({
        entity,
        operations,
        skipRoles,
        skipIsAuthenticated,
        allow,
        context,
        escapeQuotes,
        bind,
        where,
    });
    if (!authPredicate)
        return ["", {}];
    const authPredicateExpr = new cypher_builder_1.default.RawCypher((env) => {
        return authPredicate.getCypher(env);
    });
    const chainStr = generateUniqueChainStr([where?.varName, allow?.varName, bind?.varName]);
    // Params must be globally unique, variables can be just slightly different, as each auth statement is scoped
    const authCypher = authPredicateExpr.build({ params: `${chainStr}auth_`, variables: `auth_` });
    return [authCypher.cypher, authCypher.params];
}
exports.createAuthAndParams = createAuthAndParams;
function generateUniqueChainStr(varNames) {
    return varNames
        .map((v) => {
        return typeof v === "string" ? v : "";
    })
        .join("");
}
function createAuthPredicates({ entity, operations, skipRoles, skipIsAuthenticated, allow, context, escapeQuotes, bind, where, }) {
    if (!entity.auth) {
        return undefined;
    }
    /** FIXME: this is required to keep compatibility with BaseField type */
    const nodeAuth = new NodeAuth_1.NodeAuth(entity.auth);
    const authRules = nodeAuth.getRules(operations);
    const hasWhere = (rule) => !!(rule.where || rule.AND?.some(hasWhere) || rule.OR?.some(hasWhere));
    if (where && !authRules.some(hasWhere)) {
        return undefined;
    }
    const subPredicates = authRules.map((authRule) => {
        const predicate = createSubPredicate({
            authRule,
            skipRoles,
            skipIsAuthenticated,
            allow,
            context,
            escapeQuotes,
            bind,
            where,
        });
        return predicate;
    });
    const orPredicates = cypher_builder_1.default.or(...subPredicates);
    if (!orPredicates)
        return undefined;
    const authPredicate = new cypher_builder_1.default.RawCypher((env) => {
        return orPredicates.getCypher(env);
    });
    return authPredicate;
}
exports.createAuthPredicates = createAuthPredicates;
function createSubPredicate({ authRule, skipRoles, skipIsAuthenticated, allow, context, escapeQuotes, bind, where, }) {
    const thisPredicates = [];
    const authParam = new cypher_builder_1.default.NamedParam("auth");
    if (!skipRoles && authRule.roles) {
        const rolesPredicate = createRolesPredicate(authRule.roles, authParam.property("roles"));
        thisPredicates.push(rolesPredicate);
    }
    if (!skipIsAuthenticated && (authRule.isAuthenticated === true || authRule.isAuthenticated === false)) {
        const authenticatedPredicate = createAuthenticatedPredicate(authRule.isAuthenticated, authParam.property("isAuthenticated"));
        thisPredicates.push(authenticatedPredicate);
    }
    if (allow && authRule.allow) {
        const nodeRef = (0, get_or_create_cypher_variable_1.getOrCreateCypherNode)(allow.varName);
        const allowAndParams = createAuthPredicate({
            context,
            node: allow.parentNode,
            nodeRef,
            rule: authRule,
            kind: "allow",
        });
        if (allowAndParams) {
            thisPredicates.push(allowAndParams);
        }
    }
    join_predicates_1.PREDICATE_JOINS.forEach((key) => {
        const value = authRule[key];
        if (!value) {
            return;
        }
        const predicates = [];
        value.forEach((v) => {
            const predicate = createSubPredicate({
                authRule: v,
                skipRoles,
                skipIsAuthenticated,
                allow,
                context,
                escapeQuotes,
                bind,
                where,
            });
            if (!predicate) {
                return;
            }
            predicates.push(predicate);
        });
        let joinedPredicate;
        if (key === "AND") {
            joinedPredicate = cypher_builder_1.default.and(...predicates);
        }
        else if (key === "OR") {
            joinedPredicate = cypher_builder_1.default.or(...predicates);
        }
        if (joinedPredicate) {
            thisPredicates.push(joinedPredicate);
        }
    });
    if (where && authRule.where) {
        const nodeRef = (0, get_or_create_cypher_variable_1.getOrCreateCypherNode)(where.varName);
        const wherePredicate = createAuthPredicate({
            context,
            node: where.node,
            nodeRef,
            rule: authRule,
            kind: "where",
        });
        if (wherePredicate) {
            thisPredicates.push(wherePredicate);
        }
    }
    if (bind && authRule.bind) {
        const nodeRef = (0, get_or_create_cypher_variable_1.getOrCreateCypherNode)(bind.varName);
        const allowPredicate = createAuthPredicate({
            context,
            node: bind.parentNode,
            nodeRef,
            rule: authRule,
            kind: "bind",
        });
        if (allowPredicate) {
            thisPredicates.push(allowPredicate);
        }
    }
    return cypher_builder_1.default.and(...thisPredicates);
}
function createAuthPredicate({ rule, node, nodeRef, context, kind, }) {
    if (!rule[kind]) {
        return undefined;
    }
    const { allowUnauthenticated } = rule;
    const predicates = [];
    Object.entries(rule[kind]).forEach(([key, value]) => {
        if ((0, join_predicates_1.isPredicateJoin)(key)) {
            const inner = [];
            value.forEach((v) => {
                const authPredicate = createAuthPredicate({
                    rule: {
                        [kind]: v,
                        allowUnauthenticated,
                    },
                    nodeRef,
                    node,
                    context,
                    kind,
                });
                if (authPredicate) {
                    inner.push(authPredicate);
                }
            });
            let operator;
            if (key === "AND") {
                operator = cypher_builder_1.default.and(...inner);
            }
            else if (key === "OR") {
                operator = cypher_builder_1.default.or(...inner);
            }
            if (operator)
                predicates.push(operator);
        }
        const authableField = node.authableFields.find((field) => field.fieldName === key);
        if (authableField) {
            const jwtPath = (0, utils_1.isString)(value) ? context_parser_1.default.parseTag(value, "jwt") : undefined;
            let ctxPath = (0, utils_1.isString)(value) ? context_parser_1.default.parseTag(value, "context") : undefined;
            let paramValue = value;
            if (jwtPath)
                ctxPath = `jwt.${jwtPath}`;
            if (ctxPath) {
                paramValue = context_parser_1.default.getProperty(ctxPath, context);
            }
            if (paramValue === undefined && allowUnauthenticated !== true) {
                throw new classes_1.Neo4jGraphQLAuthenticationError("Unauthenticated");
            }
            const fieldPredicate = createAuthField({
                param: new cypher_builder_1.default.Param(paramValue),
                key,
                node,
                elementRef: nodeRef,
            });
            predicates.push(fieldPredicate);
        }
        const relationField = node.relationFields.find((x) => key === x.fieldName);
        if (relationField) {
            const refNode = context.nodes.find((x) => x.name === relationField.typeMeta.name);
            const relationshipNodeRef = new cypher_builder_1.default.Node({
                labels: refNode.getLabels(context),
            });
            Object.entries(value).forEach(([k, v]) => {
                const authPredicate = createAuthPredicate({
                    node: refNode,
                    context,
                    nodeRef: relationshipNodeRef,
                    rule: {
                        [kind]: { [k]: v },
                        allowUnauthenticated,
                    },
                    kind,
                });
                if (!authPredicate)
                    throw new Error("Invalid predicate");
                const relationshipPredicate = createRelationshipPredicate({
                    targetNodeRef: relationshipNodeRef,
                    nodeRef,
                    relationField,
                    authPredicate,
                    kind,
                    context,
                });
                predicates.push(relationshipPredicate);
            });
        }
    });
    return cypher_builder_1.default.and(...predicates);
}
function createRelationshipPredicate({ nodeRef, relationField, targetNodeRef, authPredicate, kind, context, }) {
    const relationship = new cypher_builder_1.default.Relationship({
        source: nodeRef,
        target: targetNodeRef,
        type: relationField.type,
    });
    const innerPattern = relationship.pattern({
        relationship: {
            variable: false,
        },
        source: {
            variable: true,
            labels: false,
        },
    });
    const existsPattern = relationship.pattern({
        target: {
            variable: false,
        },
        source: {
            variable: true,
            labels: false,
        },
        relationship: {
            variable: false,
        },
    });
    if (relationField.direction === "IN") {
        innerPattern.reverse();
        existsPattern.reverse();
    }
    let predicateFunction;
    if (kind === "allow") {
        predicateFunction = cypher_builder_1.default.any(targetNodeRef, new cypher_builder_1.default.PatternComprehension(innerPattern, targetNodeRef), authPredicate);
    }
    else {
        if (!context.plugins?.auth) {
            throw new Error("Auth plugin is undefined");
        }
        predicateFunction = cypher_builder_1.default[context.plugins?.auth?.bindPredicate](targetNodeRef, new cypher_builder_1.default.PatternComprehension(innerPattern, targetNodeRef), authPredicate);
    }
    const existsFunction = cypher_builder_1.default.exists(existsPattern);
    return cypher_builder_1.default.and(existsFunction, predicateFunction);
}
function createRolesPredicate(roles, rolesParam) {
    const roleVar = new cypher_builder_1.default.Variable();
    const rolesList = new cypher_builder_1.default.Literal(roles);
    const roleInParamPredicate = isValueInListCypher(roleVar, rolesParam);
    const rolesInListComprehension = cypher_builder_1.default.any(roleVar, rolesList, roleInParamPredicate);
    return rolesInListComprehension;
}
function createAuthenticatedPredicate(authenticated, authenticatedParam) {
    const authenticatedPredicate = cypher_builder_1.default.not(cypher_builder_1.default.eq(authenticatedParam, new cypher_builder_1.default.Literal(authenticated)));
    return new cypher_builder_1.default.apoc.ValidatePredicate(authenticatedPredicate, constants_1.AUTH_UNAUTHENTICATED_ERROR);
}
function createAuthField({ node, key, elementRef, param, }) {
    const dbFieldName = (0, map_to_db_property_1.default)(node, key);
    const fieldPropertyRef = elementRef.property(dbFieldName);
    if (param.value === undefined) {
        return new cypher_builder_1.default.Literal(false);
    }
    if (param.value === null) {
        return cypher_builder_1.default.isNull(fieldPropertyRef);
    }
    const isNotNull = cypher_builder_1.default.isNotNull(fieldPropertyRef);
    const equalsToParam = cypher_builder_1.default.eq(fieldPropertyRef, param);
    return cypher_builder_1.default.and(isNotNull, equalsToParam);
}
function isValueInListCypher(value, list) {
    const listItemVar = new cypher_builder_1.default.Variable();
    return cypher_builder_1.default.any(listItemVar, list, cypher_builder_1.default.eq(listItemVar, value));
}
//# sourceMappingURL=create-auth-and-params.js.map