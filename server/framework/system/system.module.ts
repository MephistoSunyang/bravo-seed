import { RepositoryModule } from '@bravo/core';
import { Module } from '@nestjs/common';
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

@Module({
  imports: [...modules],
  controllers,
  providers,
  exports: [...providers],
})
export class SystemModule {}
