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
exports.ConcreteEntity = void 0;
class ConcreteEntity {
    constructor({ name, labels, attributes = [] }) {
        this.attributes = new Map();
        this.name = name;
        this.labels = new Set(labels);
        for (const attribute of attributes) {
            this.addAttribute(attribute);
        }
    }
    matchLabels(labels) {
        return this.setsAreEqual(new Set(labels), this.labels);
    }
    addAttribute(attribute) {
        if (this.attributes.has(attribute.name)) {
            throw new Error(`Attribute ${attribute.name} already exists in ${this.name}`);
        }
        this.attributes.set(attribute.name, attribute);
    }
    setsAreEqual(a, b) {
        if (a.size !== b.size) {
            return false;
        }
        return Array.from(a).every((element) => {
            return b.has(element);
        });
    }
}
exports.ConcreteEntity = ConcreteEntity;
//# sourceMappingURL=ConcreteEntity.js.map