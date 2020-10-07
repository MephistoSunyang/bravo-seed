import { RepositoryModule } from '@bravo/core';
import { Global, Module, OnModuleInit } from '@nestjs/common';
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
const modules = [RepositoryModule.forFeature(entities)];
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
export class SystemModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  public async onModuleInit(): Promise<void> {
    await this.configService.initializeConfigCaches();
  }
}
