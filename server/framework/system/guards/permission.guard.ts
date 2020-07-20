import { getCurrentUserId, Logger } from '@bravo/core';
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
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionGuardEnable = process.env.PERMISSION_GUARD_ENABLE === 'true';
    const disablePermissionGuard = this.reflector.get<boolean>(
      'disablePermissionGuard',
      context.getHandler(),
    );
    const isAuthorized = httpContext.get('isAuthorized');
    if (!permissionGuardEnable || disablePermissionGuard || isAuthorized) {
      return true;
    }
    const userId = getCurrentUserId();
    if (!userId) {
      throw new UnauthorizedException(`Not found user by PermissionGuard!`);
    }
    const codes = this.reflector.get<string[]>('permissionCodes', context.getClass());
    const permissions = await this.userService.getPermissionsByUserId(userId, codes);
    const validation = permissions.length === 0 ? false : true;
    httpContext.set('isAuthorized', validation);
    if (!validation) {
      Logger.warn(
        `User id "${userId}" not have permission by codes "${codes.join(',')}"!`,
        'AuthorizationModule PermissionGuard',
      );
      throw new ForbiddenException('Not found permission by PermissionGuard!');
    }
    return validation;
  }
}
