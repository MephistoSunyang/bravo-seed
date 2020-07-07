import { NestMiddleware } from '@nestjs/common';
import { IRequest, IResponse } from '../../shared';
export declare class GetCurrentUserMiddleware implements NestMiddleware {
    use(request: IRequest, response: IResponse, next: () => void): Promise<void>;
}
