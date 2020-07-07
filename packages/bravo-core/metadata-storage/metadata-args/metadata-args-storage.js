"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataArgsStorage = void 0;
const lodash_1 = __importDefault(require("lodash"));
class MetadataArgsStorage {
    constructor() {
        this.auditLogs = [];
    }
    findAuditLog(target) {
        return lodash_1.default.find(this.auditLogs, { target });
    }
}
exports.MetadataArgsStorage = MetadataArgsStorage;
