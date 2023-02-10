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
exports.parseBearerToken = exports.getToken = void 0;
const http_1 = require("http");
const debug_1 = __importDefault(require("debug"));
const constants_1 = require("../constants");
const debug = (0, debug_1.default)(constants_1.DEBUG_AUTH);
function getToken(context) {
    const req = context instanceof http_1.IncomingMessage ? context : context.req || context.request;
    if (!req) {
        debug("Could not get .req or .request from context");
        return;
    }
    if (!req.headers && !req.cookies) {
        debug(".headers or .cookies not found on req");
        return;
    }
    const authorization = req?.headers?.authorization || req?.headers?.Authorization || req.cookies?.token;
    if (!authorization) {
        debug("Could not get .authorization, .Authorization or .cookies.token from req");
        return;
    }
    const token = authorization.split("Bearer ")[1];
    if (!token) {
        debug("Authorization header was not in expected format 'Bearer <token>'");
        return token;
    }
    return token;
}
exports.getToken = getToken;
function parseBearerToken(bearerAuth) {
    const token = bearerAuth.split("Bearer ")[1];
    if (!token) {
        debug("Authorization header was not in expected format 'Bearer <token>'");
    }
    return token;
}
exports.parseBearerToken = parseBearerToken;
//# sourceMappingURL=get-token.js.map