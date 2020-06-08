"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResult = exports.getRootPath = exports.getPath = exports.isProduction = exports.isQuality = exports.isDevelopment = exports.isLocal = void 0;
const common_1 = require("@nestjs/common");
const path_1 = __importDefault(require("path"));
const exception_1 = require("../exception");
const enums_1 = require("./enums");
exports.isLocal = () => process.env.ENVIRONMENT &&
    process.env.ENVIRONMENT.toUpperCase() === enums_1.ENVIRONMENT_ENUM.LOCAL.toUpperCase();
exports.isDevelopment = () => process.env.ENVIRONMENT &&
    process.env.ENVIRONMENT.toUpperCase() === enums_1.ENVIRONMENT_ENUM.DEVELOPMENT.toUpperCase();
exports.isQuality = () => process.env.ENVIRONMENT &&
    process.env.ENVIRONMENT.toUpperCase() === enums_1.ENVIRONMENT_ENUM.QUALITY.toUpperCase();
exports.isProduction = () => process.env.ENVIRONMENT &&
    process.env.ENVIRONMENT.toUpperCase() === enums_1.ENVIRONMENT_ENUM.PRODUCTION.toUpperCase();
exports.getPath = (...paths) => {
    return exports.getRootPath('server', ...paths);
};
exports.getRootPath = (...paths) => {
    return path_1.default.join(process.cwd(), ...paths);
};
function createResult(contentOrError = {}, code = enums_1.HTTP_STATUS_CODE_ENUM.OK) {
    let content = {};
    let message = '';
    if (contentOrError instanceof exception_1.BusinessException) {
        if (contentOrError.frontendMessage) {
            message = contentOrError.frontendMessage;
        }
    }
    else if (contentOrError instanceof common_1.HttpException) {
        code = contentOrError.getStatus();
    }
    else if (contentOrError instanceof Error) {
        code = enums_1.HTTP_STATUS_CODE_ENUM.INTERNAL_SERVER_ERROR;
    }
    else {
        content = contentOrError;
    }
    const result = {
        content,
        code,
        message,
    };
    return result;
}
exports.createResult = createResult;
