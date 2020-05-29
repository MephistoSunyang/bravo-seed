import { Logger as NestLogger, LoggerService } from '@nestjs/common';
export declare class Logger extends NestLogger implements LoggerService {
    static verbose(message: any, context?: string): void;
    static debug(message: any, context?: string): void;
    static log(message: any, context?: string): void;
    static warn(message: any, context?: string): void;
    static error(message: any, context?: string, trace?: string): void;
}
