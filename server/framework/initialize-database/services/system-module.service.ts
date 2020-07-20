import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';
import moment from 'moment';
import { CryptoUserService } from '../../crypto';
import {
  FeatureClaimEntity,
  FeatureEntity,
  FEATURE_CLAIM_TYPE_ENUM,
  MenuEntity,
  PermissionEntity,
  RoleClaimEntity,
  RoleEntity,
  ROLE_CLAIM_TYPE_ENUM,
  UserEntity,
} from '../../system';
import { SYSTEM_MENU_CONFIG, SYSTEM_PERMISSION_CONFIG } from '../configs';

@Injectable()
export class SystemModuleService {
  constructor(
    @InjectRepositoryService(UserEntity)
    private readonly userRepositoryService: RepositoryService<UserEntity>,
    @InjectRepositoryService(RoleEntity)
    private readonly roleRepositoryService: RepositoryService<RoleEntity>,
    @InjectRepositoryService(RoleClaimEntity)
    private readonly roleClaimRepositoryService: RepositoryService<RoleClaimEntity>,
    @InjectRepositoryService(FeatureEntity)
    private readonly featureRepositoryService: RepositoryService<FeatureEntity>,
    @InjectRepositoryService(FeatureClaimEntity)
    private readonly featureClaimRepositoryService: RepositoryService<FeatureClaimEntity>,
    @InjectRepositoryService(MenuEntity)
    private readonly menuRepositoryService: RepositoryService<MenuEntity>,
    @InjectRepositoryService(PermissionEntity)
    private readonly permissionRepositoryService: RepositoryService<PermissionEntity>,
    private readonly cryptoUserService: CryptoUserService,
  ) {}

  public async initializeDatabase(): Promise<void> {
    const { DEFAULT_ADMIN_USERNAME: username, DEFAULT_ADMIN_PASSWORD: password } = process.env;
    if (!username || !password) {
      throw new Error(
        'Not found environment variable DEFAULT_ADMIN_USERNAME or DEFAULT_ADMIN_PASSWORD!',
      );
    }
    try {
      const beginTime = moment();
      const createdUserId = '0';
      const role = await this.roleRepositoryService.insert({
        code: 'supperAdmin',
        name: '超级管理员',
        createdUserId,
      });
      await this.userRepositoryService.insert({
        username,
        password: this.cryptoUserService.encodePassword(password),
        roles: [role],
        createdUserId,
      });
      const featureModel = this.featureRepositoryService.create({
        code: 'system',
        name: '系统模块功能',
        createdUserId,
      });
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
      const [feature, menus, permissions] = await Promise.all([
        this.featureRepositoryService.insert(featureModel),
        this.menuRepositoryService.insertBulk(menuModels),
        this.permissionRepositoryService.insertBulk(permissionModels),
      ]);
      const roleClaimModel = this.roleClaimRepositoryService.create({
        roleId: role.id,
        type: ROLE_CLAIM_TYPE_ENUM.FEATURE,
        key: _.toString(feature.id),
      });
      const featureClaimModels = _.chain(menus)
        .map((menu) =>
          this.featureClaimRepositoryService.create({
            featureId: feature.id,
            type: FEATURE_CLAIM_TYPE_ENUM.MENU,
            key: _.toString(menu.id),
          }),
        )
        .concat(
          _.map(permissions, (permission) =>
            this.featureClaimRepositoryService.create({
              featureId: feature.id,
              type: FEATURE_CLAIM_TYPE_ENUM.PERMISSION,
              key: _.toString(permission.id),
            }),
          ),
        )
        .value();
      await Promise.all([
        this.roleClaimRepositoryService.insert(roleClaimModel),
        this.featureClaimRepositoryService.insertBulk(featureClaimModels),
      ]);
      const seconds = moment().diff(beginTime, 'second');
      Logger.log(`System module initialize database complete!It takes ${seconds} seconds.`);
    } catch (error) {
      Logger.error(error, 'InitializeDatabaseModule SystemModuleService');
    }
  }
}
