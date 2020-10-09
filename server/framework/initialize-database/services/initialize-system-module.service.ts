import { InjectRepositoryService, Logger, RepositoryService } from '@bravo/core';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import moment from 'moment';
import { CryptoUserService } from '../../crypto';
import {
  MenuEntity,
  PermissionEntity,
  RoleClaimEntity,
  RoleEntity,
  ROLE_CLAIM_TYPE_ENUM,
  UserEntity,
} from '../../system';
import { SYSTEM_MENU_CONFIG, SYSTEM_PERMISSION_CONFIG } from '../configs';

@Injectable()
export class InitializeSystemModuleService {
  constructor(
    @InjectRepositoryService(UserEntity)
    private readonly userRepositoryService: RepositoryService<UserEntity>,
    @InjectRepositoryService(RoleEntity)
    private readonly roleRepositoryService: RepositoryService<RoleEntity>,
    @InjectRepositoryService(RoleClaimEntity)
    private readonly roleClaimRepositoryService: RepositoryService<RoleClaimEntity>,
    @InjectRepositoryService(MenuEntity)
    private readonly menuRepositoryService: RepositoryService<MenuEntity>,
    @InjectRepositoryService(PermissionEntity)
    private readonly permissionRepositoryService: RepositoryService<PermissionEntity>,
    private readonly cryptoUserService: CryptoUserService,
  ) {}

  private getMenuModels(createdUserId: string): MenuEntity[] {
    const menuModels = _.map(SYSTEM_MENU_CONFIG, (config) =>
      this.menuRepositoryService.create({
        group: config.group,
        parentId: config.parentId,
        sort: config.sort,
        name: config.name,
        icon: config.icon,
        path: config.path,
        createdUserId,
      }),
    );
    return menuModels;
  }

  private getPermissionModels(createdUserId: string): PermissionEntity[] {
    const permissionModels = _.map(SYSTEM_PERMISSION_CONFIG, (config) =>
      this.permissionRepositoryService.create({
        code: config.code,
        name: config.name,
        createdUserId,
      }),
    );
    return permissionModels;
  }

  private getRoleClaimModels(
    roleId: number,
    menus: MenuEntity[],
    permissions: PermissionEntity[],
  ): RoleClaimEntity[] {
    const menuClaimModels = _.map(menus, (menu) =>
      this.roleClaimRepositoryService.create({
        roleId,
        type: ROLE_CLAIM_TYPE_ENUM.MENU,
        key: _.toString(menu.id),
      }),
    );
    const permissionClaimModels = _.map(permissions, (permission) =>
      this.roleClaimRepositoryService.create({
        roleId,
        type: ROLE_CLAIM_TYPE_ENUM.PERMISSION,
        key: _.toString(permission.id),
      }),
    );
    const roleClaimModels = [...menuClaimModels, ...permissionClaimModels];
    return roleClaimModels;
  }

  public async database(): Promise<void> {
    const {
      DEFAULT_ADMIN_ENABLE: defaultAdminEnable,
      DEFAULT_ADMIN_USERNAME: username,
      DEFAULT_ADMIN_PASSWORD: password,
    } = process.env;
    if (!username || !password) {
      throw new Error(
        'Not found environment variable DEFAULT_ADMIN_USERNAME or DEFAULT_ADMIN_PASSWORD!',
      );
    }
    try {
      const initialized = await this.roleRepositoryService
        .count({ code: 'supperAdmin' })
        .then((result) => result === 1);
      if (initialized) {
        return;
      }
      const beginTime = moment();
      const createdUserId = '0';
      const menuModels = this.getMenuModels(createdUserId);
      const permissionModels = this.getPermissionModels(createdUserId);
      const [role, menus, permissions] = await Promise.all([
        this.roleRepositoryService.insert({
          code: 'supperAdmin',
          name: '超级管理员',
          createdUserId,
        }),
        this.menuRepositoryService.insertBulk(menuModels),
        this.permissionRepositoryService.insertBulk(permissionModels),
      ]);
      const { id: roleId } = role;
      const roleClaimModels = this.getRoleClaimModels(roleId, menus, permissions);
      await this.roleClaimRepositoryService.insertBulk(roleClaimModels);
      if (defaultAdminEnable === 'true') {
        await this.userRepositoryService.insert({
          username,
          password: this.cryptoUserService.encodePassword(password),
          roles: [role],
          createdUserId,
        });
      }
      const seconds = moment().diff(beginTime, 'second');
      Logger.log(`System module initialize database complete!It takes ${seconds} seconds.`);
    } catch (error) {
      Logger.error(error, 'InitializeDatabaseModule SystemModuleService Exception');
    }
  }
}
