import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class ErrorExceptionFilter implements ExceptionFilter {
    catch(error: Error, host: ArgumentsHost): void;
}
