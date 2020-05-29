import { HttpException } from '@nestjs/common';
export declare class BusinessException extends HttpException {
    frontendMessage: string;
    constructor(message: string, frontendMessage?: string);
    constructor(message: string, code?: number);
    constructor(message: string, code?: number, frontendMessage?: string);
}
