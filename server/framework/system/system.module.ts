import { RepositoryModule } from '@bravo/core';
import { Module } from '@nestjs/common';
import { CryptoModule } from '../crypto';
import {
  ActionController,
  ConfigController,
  MenuController,
  RoleController,
  RoleGroupController,
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
  MenuController,
  RoleGroupController,
  RoleController,
];
const services = [
  ActionService,
  ConfigService,
  MenuService,
  ModelService,
  RoleGroupService,
  RoleService,
];
const providers = [...services];

@Module({
  imports: [...modules],
  controllers,
  providers,
  exports: [...providers],
})
export class SystemModule {}
