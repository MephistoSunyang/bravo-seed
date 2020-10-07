import { getCurrentUserId, IRequest, Logger } from '@bravo/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import httpContext from 'express-http-context';
import { UserService } from '../services';

@Injectable()
export class ActionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const actionGuardEnable = process.env.ACTION_GUARD_ENABLE === 'true';
    const disableActionGuard = this.reflector.get<boolean>(
      'disableActionGuard',
      context.getHandler(),
    );
    const isAuthorized = httpContext.get('isAuthorized');
    if (!actionGuardEnable || disableActionGuard || isAuthorized) {
      return true;
    }
    const userId = getCurrentUserId();
    if (!userId) {
      throw new UnauthorizedException(`Not found user by PermissionGuard!`);
    }
    const request: IRequest = context.switchToHttp().getRequest();
    const method = request.method as any;
    const path = request.route.path;
    const actions = await this.userService.getActionsByUserId(userId, method, path);
    const validation = actions.length === 0 ? false : true;
    httpContext.set('isAuthorized', validation);
    if (!validation) {
      Logger.warn(
        `User id "${userId}" not allow use action by method "${method}" and path "${path}"!`,
        'AuthorizationModule PermissionGuard',
      );
      throw new ForbiddenException('Not found action by ActionGuard!');
    }
    return validation;
  }
}
