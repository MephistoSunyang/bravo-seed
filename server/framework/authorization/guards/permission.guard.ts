import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PermissionGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
  }
}
