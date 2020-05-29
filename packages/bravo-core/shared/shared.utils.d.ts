import { HttpException } from '@nestjs/common';
import { IResult } from './interfaces';
export declare const isLocal: () => boolean | "" | undefined;
export declare const isDevelopment: () => boolean | "" | undefined;
export declare const isQuality: () => boolean | "" | undefined;
export declare const isProduction: () => boolean | "" | undefined;
export declare function createResult(error?: Error | HttpException): IResult;
export declare function createResult(error?: Error | HttpException, code?: number): IResult;
export declare function createResult(content?: any): IResult;
export declare function createResult(content?: any, code?: number): IResult;
