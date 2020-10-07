import { getErrorMessage, InjectRepositoryService, Logger, RepositoryService } from '@bravo/core';
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
import { SYNCHRONIZE_DATABASE_LOG_STATUS_ENUMS } from '../enums';
import { ISynchronizeDatabaseTaskResult } from '../interfaces';

@Injectable()
export class SystemModuleService {
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

  public async synchronizeDatabase(): Promise<ISynchronizeDatabaseTaskResult> {
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
      const beginTime = moment();
      const createdUserId = '0';
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
      const permissionModels = _.map(SYSTEM_PERMISSION_CONFIG, (config) =>
        this.permissionRepositoryService.create({
          code: config.code,
          name: config.name,
          createdUserId,
        }),
      );
      const [adminRole, menus, permissions] = await Promise.all([
        this.roleRepositoryService.insert({
          code: 'supperAdmin',
          name: '超级管理员',
          createdUserId,
        }),
        this.menuRepositoryService.insertBulk(menuModels),
        this.permissionRepositoryService.insertBulk(permissionModels),
      ]);
      const roleClaimModels = _.concat(
        _.map(menus, (menu) =>
          this.roleClaimRepositoryService.create({
            roleId: adminRole.id,
            type: ROLE_CLAIM_TYPE_ENUM.MENU,
            key: _.toString(menu.id),
          }),
        ),
        _.map(permissions, (permission) =>
          this.roleClaimRepositoryService.create({
            roleId: adminRole.id,
            type: ROLE_CLAIM_TYPE_ENUM.PERMISSION,
            key: _.toString(permission.id),
          }),
        ),
      );
      await this.roleClaimRepositoryService.insertBulk(roleClaimModels);
      if (defaultAdminEnable === 'true') {
        await this.userRepositoryService.insert({
          username,
          password: this.cryptoUserService.encodePassword(password),
          roles: [adminRole],
          createdUserId,
        });
      }
      const seconds = moment().diff(beginTime, 'second');
      Logger.log(`System module initialize database complete!It takes ${seconds} seconds.`);
      return {
        status: SYNCHRONIZE_DATABASE_LOG_STATUS_ENUMS.SUCCEED,
      };
    } catch (error) {
      Logger.error(error, 'InitializeDatabaseModule SystemModuleService Exception');
      return {
        status: SYNCHRONIZE_DATABASE_LOG_STATUS_ENUMS.FAILED,
        exception: getErrorMessage(error),
      };
    }
  }
}
