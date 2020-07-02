import { IRequest, IResponse, Logger, setCurrentUserId } from '@bravo/core';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';

@Injectable()
export class SetJwtUserIdMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  public async use(request: IRequest, response: IResponse, next: () => void): Promise<void> {
    if (request.headers.authorization) {
      const token = request.headers.authorization;
      try {
        const user = this.jwtService.decode(token);
        if (!user) {
          throw new UnauthorizedException(`Invalid token ${token}!`);
        }
        const userId = _.isString(user) ? user : _.toString(user.id);
        setCurrentUserId(userId);
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
