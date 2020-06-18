import { RepositoryModule } from '@bravo/core';
import { Module } from '@nestjs/common';
import { CryptoModule } from '../crypto';
import {
  ActionController,
  ConfigController,
  LogController,
  MenuController,
  RoleController,
  RoleGroupController,
  UserController,
} from './controllers';
import {
  ActionEntity,
  ConfigEntity,
  RoleClaimEntity,
  RoleEntity,
  RoleGroupEntity,
  UserEntity,
  UserProviderEntity,
} from './entities';
import { MenuEntity } from './entities/menu.entity';
import {
  ActionService,
  ConfigService,
  MenuService,
  ModelService,
  RoleGroupService,
  RoleService,
  UserService,
  LogService,
} from './services';

const entities = [
  ActionEntity,
  ConfigEntity,
  MenuEntity,
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
  RoleGroupController,
  RoleController,
  UserController,
];
const services = [
  ActionService,
  ConfigService,
  LogService,
  MenuService,
  ModelService,
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
