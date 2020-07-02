import { Global, Module } from '@nestjs/common';
import { ActionGuard, PermissionGuard } from './guards';

const modules = [];
const guards = [ActionGuard, PermissionGuard];
const providers = [...guards];

@Global()
@Module({
  imports: [...modules],
  providers,
})
export class AuthorizationModule {}
