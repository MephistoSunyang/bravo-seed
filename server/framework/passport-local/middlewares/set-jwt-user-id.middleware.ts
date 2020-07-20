import { IRequest, IResponse, Logger, setCurrentUserId } from '@bravo/core';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import _ from 'lodash';
import { PassportService } from '../../passport';

@Injectable()
export class SetJwtUserIdMiddleware implements NestMiddleware {
  constructor(private readonly passportService: PassportService) {}

  public async use(request: IRequest, response: IResponse, next: () => void): Promise<void> {
    const { authorization } = request.headers;
    if (authorization && _.isString(authorization)) {
      try {
        const accessToken = authorization.slice(7);
        const userId = this.passportService.getUserIdByAccessToken(accessToken);
        if (!userId) {
          throw new UnauthorizedException(`Invalid token ${accessToken}!`);
        }
        setCurrentUserId(_.toString(userId));
        next();
      } catch (error) {
        Logger.error(error, 'PassportLocalModule JwtLoginMiddleware');
        throw new UnauthorizedException();
      }
    } else {
      next();
    }
  }
}
