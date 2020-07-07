"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const lodash_1 = __importDefault(require("lodash"));
const metadata_storage_1 = require("../../metadata-storage");
const middleware_1 = require("../../middleware");
exports.AuditLog = (options = {
    enable: true,
    contentResolver: (content) => JSON.stringify(content),
    createdUserIdResolver: () => (middleware_1.getCurrentUserId() ? String(middleware_1.getCurrentUserId()) : null),
}) => {
    return (entity) => {
        metadata_storage_1.getMetadataArgsStorage().auditLogs.push(lodash_1.default.assign({ target: entity }, options));
    };
};
