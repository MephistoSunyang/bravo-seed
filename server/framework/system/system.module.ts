import { RepositoryModule } from '@bravo/core';
import { Global, Module } from '@nestjs/common';
import { CryptoModule } from '../crypto';
import {
  ActionController,
  ConfigController,
  LogController,
  MenuController,
  PermissionController,
  RoleController,
  RoleGroupController,
  UserController,
} from './controllers';
import {
  ActionEntity,
  ConfigEntity,
  MenuEntity,
  PermissionEntity,
  RoleClaimEntity,
  RoleEntity,
  RoleGroupEntity,
  UserEntity,
  UserProviderEntity,
} from './entities';
import {
  ActionService,
  ClaimService,
  ConfigService,
  LogService,
  MenuService,
  ModelService,
  PermissionService,
  RoleGroupService,
  RoleService,
  UserService,
} from './services';

const entities = [
  ActionEntity,
  ConfigEntity,
  MenuEntity,
  PermissionEntity,
  RoleClaimEntity,
  RoleGroupEntity,
  RoleEntity,
  UserProviderEntity,
  UserEntity,
];
const modules = [RepositoryModule.forFeature(entities), CryptoModule];
const controllers = [
  ActionController,
  ConfigController,
  LogController,
  MenuController,
  PermissionController,
  RoleGroupController,
  RoleController,
  UserController,
];
const services = [
  ActionService,
  ClaimService,
  ConfigService,
  LogService,
  MenuService,
  ModelService,
  PermissionService,
  RoleGroupService,
  RoleService,
  UserService,
];
const providers = [...services];

@Global()
@Module({
  imports: [...modules],
  controllers,
  providers,
  exports: [...providers],
})
export class SystemModule {}
