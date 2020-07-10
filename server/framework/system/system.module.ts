import { RepositoryModule } from '@bravo/core';
import { Global, Module } from '@nestjs/common';
import { CryptoModule } from '../crypto';
import {
  ActionController,
  ConfigController,
  FeatureController,
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
  FeatureClaimEntity,
  FeatureEntity,
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
  FeatureService,
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
  FeatureClaimEntity,
  FeatureEntity,
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
  FeatureController,
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
  FeatureService,
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
