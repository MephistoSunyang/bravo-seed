import { IRequest } from '@bravo/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ActionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, // private readonly userService: UserService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const userActionGuardEnable = process.env.USER_ACTION_GUARD_ENABLE === 'true';
    const disableUserActionGuard = this.reflector.get<boolean>(
      'disableUserActionGuard',
      context.getHandler(),
    );
    if (!userActionGuardEnable || disableUserActionGuard) {
      return true;
    }
    const request: IRequest = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new UnauthorizedException(`Not found user by UserActionGuard!`);
    }
    const userId = request.user['id'];
    const method = request.method as any;
    const path = request.route.path;
    // const validation = await this.userService.userActionValidator(userId, method, path);
    if (!true) {
      Logger.warn(
        `Not found action by paramters userId "${userId}" and method "${method}" and path "${path}"!`,
        'SystemModule UserActionGuard Warning',
      );
      throw new ForbiddenException(`Not found action by UserActionGuard!`);
    }
    return true;
  }
}
