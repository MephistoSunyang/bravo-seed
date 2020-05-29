import { AdvancedConsoleLogger, Logger, QueryRunner } from 'typeorm';
export declare class DatabaseLogger implements Logger {
    advancedConsoleLogger: AdvancedConsoleLogger;
    constructor(options?: boolean | 'all' | Array<'log' | 'info' | 'warn' | 'query' | 'schema' | 'error' | 'migration'> | undefined);
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): void;
    logMigration(message: string, queryRunner?: QueryRunner): void;
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void;
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): void;
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): void;
    logSchemaBuild(message: string, queryRunner?: QueryRunner): void;
}
