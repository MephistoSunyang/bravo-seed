import { IRequest, IResponse, Logger, setCurrentUserId } from '@bravo/core';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import _ from 'lodash';
import { PassportJwtService } from '../services';

@Injectable()
export class SetJwtUserIdMiddleware implements NestMiddleware {
  constructor(private readonly passportJwtService: PassportJwtService) {}

  public async use(request: IRequest, response: IResponse, next: () => void): Promise<void> {
    const { authorization } = request.headers;
    if (authorization && _.isString(authorization)) {
      try {
        const accessToken = authorization.replace('Bearer ', '');
        const payload = await this.passportJwtService.getPayloadByAccessToken(accessToken);
        setCurrentUserId(_.toString(payload.userId));
        next();
      } catch (error) {
        Logger.error(error, 'PassportLocalModule JwtLoginMiddleware Exception');
        throw new UnauthorizedException();
      }
    } else {
      next();
    }
  }
}
