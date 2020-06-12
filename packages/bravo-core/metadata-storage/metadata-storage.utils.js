"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataArgsStorage = void 0;
const PlatformTools_1 = require("typeorm/platform/PlatformTools");
const metadata_args_1 = require("./metadata-args");
function getMetadataArgsStorage() {
    const globalScope = PlatformTools_1.PlatformTools.getGlobalVariable();
    if (!globalScope.bravoCoreMetadataArgsStorage) {
        globalScope.bravoCoreMetadataArgsStorage = new metadata_args_1.MetadataArgsStorage();
    }
    return globalScope.bravoCoreMetadataArgsStorage;
}
exports.getMetadataArgsStorage = getMetadataArgsStorage;
