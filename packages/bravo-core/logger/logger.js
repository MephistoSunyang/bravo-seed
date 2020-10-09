"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("../shared");
const logger_utils_1 = require("./logger.utils");
class Logger extends common_1.Logger {
    static verbose(message, context = 'Nest Application Verbose') {
        super.verbose(message, context);
    }
    static debug(message, context = 'Nest Application Debug') {
        super.debug(message, context);
    }
    static log(message, context = 'Nest Application Log') {
        logger_utils_1.logger(`[${context} Log]`).info(message);
        super.log(message, context);
    }
    static warn(message, context = 'Nest Application Warn') {
        logger_utils_1.logger(`[${context} Warn]`).warn(message);
        super.warn(message, context);
    }
    static error(message, context = 'Nest Application Error', trace = '') {
        const errorMessage = message instanceof Error ? shared_1.getErrorMessage(message) : message;
        logger_utils_1.logger(`[${context} Error]`).error(errorMessage, trace);
        super.error(errorMessage, trace, context);
    }
}
exports.Logger = Logger;
