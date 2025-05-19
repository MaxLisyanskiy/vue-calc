"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUniqueId = void 0;
const idSet = new Set();
const createUniqueId = () => {
    let uniqueId;
    do {
        uniqueId = Math.floor(Math.random() * 1000000);
    } while (idSet.has(uniqueId));
    idSet.add(uniqueId);
    return uniqueId;
};
exports.createUniqueId = createUniqueId;
