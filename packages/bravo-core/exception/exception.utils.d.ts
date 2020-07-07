import { HttpException } from '@nestjs/common';
import { IResponse } from '../shared';
export declare const handleException: (error: Error | HttpException, response: IResponse) => void;
