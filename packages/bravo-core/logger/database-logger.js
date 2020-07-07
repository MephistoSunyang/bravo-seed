"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseLogger = void 0;
const typeorm_1 = require("typeorm");
const logger_utils_1 = require("./logger.utils");
class DatabaseLogger {
    constructor(options) {
        this.advancedConsoleLogger = new typeorm_1.AdvancedConsoleLogger(options);
    }
    log(level, message, queryRunner) {
        if (level === 'log') {
            logger_utils_1.logger('[Database Log]').log(message);
        }
        if (level === 'info') {
            logger_utils_1.logger('[Database Info]').info(message);
        }
        if (level === 'warn') {
            logger_utils_1.logger('[Database Warn]').warn(message);
        }
        this.advancedConsoleLogger.log(level, message, queryRunner);
    }
    logMigration(message, queryRunner) {
        this.advancedConsoleLogger.logMigration(message, queryRunner);
    }
    logQuery(query, parameters, queryRunner) {
        this.advancedConsoleLogger.logQuery(query, parameters, queryRunner);
    }
    logQueryError(error, query, parameters, queryRunner) {
        logger_utils_1.logger('[Database Error]').error(error);
        this.advancedConsoleLogger.logQueryError(error, query, parameters, queryRunner);
    }
    logQuerySlow(time, query, parameters, queryRunner) {
        this.advancedConsoleLogger.logQuerySlow(time, query, parameters, queryRunner);
    }
    logSchemaBuild(message, queryRunner) {
        this.advancedConsoleLogger.logSchemaBuild(message, queryRunner);
    }
}
exports.DatabaseLogger = DatabaseLogger;
