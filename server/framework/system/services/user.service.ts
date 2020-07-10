import { BusinessException, InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import _ from 'lodash';
import { Connection, In, ObjectType, SelectQueryBuilder } from 'typeorm';
import { CryptoUserService } from '../../crypto';
import {
  ActionEntity,
  FeatureClaimEntity,
  FeatureEntity,
  MenuEntity,
  PermissionEntity,
  RoleClaimEntity,
  UserEntity,
  UserProviderEntity,
} from '../entities';
import {
  ACTION_METHOD_ENUM,
  FEATURE_CLAIM_TYPE_ENUM,
  ROLE_CLAIM_TYPE_ENUM,
  USER_PROVIDER_TYPE_NAME_ENUM,
} from '../enums';
import { ISelectOption } from '../interfaces';
import {
  CreatedUserModel,
  MenuModel,
  QueryCurrentUserMenuModel,
  QueryUserAndCountModel,
  QueryUserModel,
  UpdatedUserModel,
  UserAndCountModel,
  UserModel,
} from '../models';
import { ModelService } from './model.service';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepositoryService(UserEntity)
    private readonly userRepositoryService: RepositoryService<UserEntity>,
    @InjectRepositoryService(UserProviderEntity)
    private readonly userProviderRepositoryService: RepositoryService<UserProviderEntity>,
    private readonly modelService: ModelService,
    private readonly cryptoUserService: CryptoUserService,
  ) {}

  private mapper(users: UserEntity[]): UserModel[];
  private mapper(user: UserEntity): UserModel;
  private mapper(userOrUsers: UserEntity[] | UserEntity): UserModel[] | UserModel {
    return this.modelService.mapper(UserModel, userOrUsers);
  }

  private getUsersQueryBuilderByQuery(queries: QueryUserModel): SelectQueryBuilder<UserEntity> {
    const {
      username,
      nickname,
      realname,
      phone,
      phoneConfirmed,
      email,
      emailConfirmed,
      comment,
      type,
      roleId,
    } = queries;
    const usersQueryBuilder = this.userRepositoryService
      .createQueryBuilder('users')
      .leftJoin(UserProviderEntity, 'providers', 'providers.userId = users.id')
      .leftJoinAndSelect('users.roles', 'roles', 'roles.isDeleted = 0')
      .where('users.isDeleted = 0');
    if (username) {
      usersQueryBuilder.andWhere('users.username LIKE :username', { username });
    }
    if (nickname) {
      usersQueryBuilder.andWhere('users.nickname LIKE :nickname', { nickname });
    }
    if (realname) {
      usersQueryBuilder.andWhere('users.realname LIKE :realname', { realname });
    }
    if (phone) {
      usersQueryBuilder.andWhere('users.phone LIKE :phone', { phone });
    }
    if (phoneConfirmed) {
      usersQueryBuilder.andWhere('users.phoneConfirmed = phoneConfirmed', { phoneConfirmed });
    }
    if (email) {
      usersQueryBuilder.andWhere('users.email LIKE :phone', { email });
    }
    if (emailConfirmed) {
      usersQueryBuilder.andWhere('users.emailConfirmed = phoneConfirmed', { emailConfirmed });
    }
    if (comment) {
      usersQueryBuilder.andWhere('users.comment LIKE :comment', { comment });
    }
    if (type) {
      if (type === 'LOCAL') {
        usersQueryBuilder.where(
          'users.id NOT IN (SELECT userId FROM system.[user-providers] GROUP BY userId)',
        );
      } else {
        usersQueryBuilder.andWhere('providers.type = :type', { type });
      }
    }
    if (roleId) {
      usersQueryBuilder.andWhere('roles.id = :roleId', { roleId });
    }
    usersQueryBuilder.orderBy('users.modifiedDate', 'DESC');
    return usersQueryBuilder;
  }

  private async getUserModels(users: UserEntity[]): Promise<UserModel[]> {
    if (users.length === 0) {
      return [];
    }
    const userIds = _.map(users, 'id');
    const userProviders = await this.userProviderRepositoryService.find({
      userId: In(userIds),
    });
    const userModels = this.mapper(users);
    userModels.forEach((userModel) => {
      const types = _.chain(userProviders)
        .filter({ userId: userModel.id })
        .map('type')
        .uniq()
        .value();
      userModel.types = types;
    });
    return userModels;
  }

  public _getUsersTypes(): ISelectOption[] {
    const usersTypes = _.chain(USER_PROVIDER_TYPE_NAME_ENUM)
      .keys()
      .map((key) => ({ name: USER_PROVIDER_TYPE_NAME_ENUM[key], value: key }))
      .value();
    return usersTypes;
  }

  public async _getUsersAndCount(queries: QueryUserAndCountModel): Promise<UserAndCountModel> {
    const offset = (queries.pageNumber - 1) * queries.pageSize;
    const limit = queries.pageSize;
    const [users, count] = await this.getUsersQueryBuilderByQuery(queries)
      .offset(offset)
      .limit(limit)
      .getManyAndCount();
    const userModels = await this.getUserModels(users);
    return { data: userModels, count };
  }

  public async _getUsers(queries: QueryUserModel): Promise<UserModel[]> {
    const usersQueryBuilder = this.getUsersQueryBuilderByQuery(queries);
    const users = await usersQueryBuilder.getMany();
    const userModels = await this.getUserModels(users);
    return userModels;
  }

  public async _getUserById(id: number): Promise<UserModel> {
    const user = await this.getUserByIdOrFail(id);
    const userModel = this.mapper(user);
    return userModel;
  }

  public async _getCurrentUserMenus(
    userId: number,
    queryCurrentUserMenu: QueryCurrentUserMenuModel,
  ): Promise<MenuModel[]> {
    const { groups } = queryCurrentUserMenu;
    const menus = await this.getMenusByUserId(userId, groups);
    const menuModels = this.modelService.mapper(MenuModel, menus);
    return menuModels;
  }

  public async _createUser(createdUserModel: CreatedUserModel): Promise<UserModel> {
    const password = createdUserModel.password
      ? this.cryptoUserService.encodePassword(createdUserModel.password)
      : undefined;
    const model = this.userRepositoryService.merge(createdUserModel, { password });
    const user = await this.userRepositoryService.insert(model);
    const userModel = this.mapper(user);
    return userModel;
  }

  public async _updateUserById(id: number, updatedUserModel: UpdatedUserModel): Promise<UserModel> {
    const user = await this.userRepositoryService.update(id, updatedUserModel);
    if (!user) {
      throw new NotFoundException(`Not found system user by id "${id}"!`);
    }
    const userModel = this.mapper(user);
    return userModel;
  }

  public async _replacePassword(
    id: number,
    password: string,
    newPassword: string,
  ): Promise<UserModel> {
    const encodePassword = this.cryptoUserService.encodePassword(password);
    const user = await this.userRepositoryService.findOne(id, { select: ['password'] });
    if (!user) {
      throw new NotFoundException(`Not found system user by id "${id}"!`);
    }
    if (user.password !== encodePassword) {
      throw new BusinessException(`User id "${id}" password invalid!`, '密码不正确');
    }
    const encodeNewPassword = this.cryptoUserService.encodePassword(newPassword);
    const updatedUser = await this.userRepositoryService.update(id, {
      password: encodeNewPassword,
    });
    const userModel = this.mapper(updatedUser!);
    return userModel;
  }

  public async _deleteUserById(id: number): Promise<UserModel> {
    const user = await this.userRepositoryService.delete(id);
    if (!user) {
      throw new NotFoundException(`Not found user by id "${id}"!`);
    }
    const userModel = this.mapper(user);
    return userModel;
  }

  public async getUserByIdOrFail(id: number): Promise<UserEntity> {
    const user = await this.userRepositoryService.findOne({ id });
    if (!user) {
      throw new NotFoundException(`Not found system user by id "${id}"!`);
    }
    return user;
  }

  public getRoleClaimsQueryBuilderByUserId<IClaimEntity>(
    claimEntity: ObjectType<IClaimEntity>,
    claimType: ROLE_CLAIM_TYPE_ENUM,
    userId: number,
  ): SelectQueryBuilder<IClaimEntity> {
    return this.connection
      .createQueryBuilder(claimEntity, 'claims')
      .innerJoin(
        (selectQuery) =>
          selectQuery
            .from(RoleClaimEntity, 'roleClaims')
            .where('type = :type', { type: claimType }),
        'roleClaims',
        'roleClaims."key" = claims.id',
      )
      .innerJoin(
        (selectQuery) =>
          selectQuery
            .from(UserEntity, 'users')
            .select('roles.id', 'id')
            .leftJoin('users.roles', 'roles')
            .where('users.isDeleted = 0')
            .andWhere('roles.isDeleted = 0')
            .andWhere('users.id = :userId', { userId }),
        'roles',
        'roles.id = roleClaims.roleId',
      );
  }

  public getFeatureClaimQueryBuilderByUserId<IClaimEntity>(
    entity: ObjectType<IClaimEntity>,
    type: FEATURE_CLAIM_TYPE_ENUM,
    userId: number,
  ): SelectQueryBuilder<IClaimEntity> {
    return this.connection
      .createQueryBuilder(entity, 'claims')
      .innerJoin(
        (selectQuery) =>
          selectQuery.from(FeatureClaimEntity, 'featureClaims').where('type = :type', { type }),
        'featureClaims',
        'featureClaims."key" = claims.id',
      )
      .innerJoin(
        (selectQuery) => selectQuery.from(FeatureEntity, 'features').where('isDeleted = 0'),
        'features',
        'features.id = featureClaims.featureId',
      )
      .innerJoin(
        (selectQuery) =>
          selectQuery
            .from(RoleClaimEntity, 'roleClaims')
            .where('type = :roleClaimType', { roleClaimType: ROLE_CLAIM_TYPE_ENUM.FEATURE }),
        'roleClaims',
        'roleClaims."key" = features.id',
      )
      .innerJoin(
        (selectQuery) =>
          selectQuery
            .from(UserEntity, 'users')
            .select('roles.id', 'id')
            .leftJoin('users.roles', 'roles')
            .where('users.isDeleted = 0')
            .andWhere('roles.isDeleted = 0')
            .andWhere('users.id = :userId', { userId }),
        'roles',
        'roles.id = roleClaims.roleId',
      );
  }

  public getFeaturesByUserId(userId: number, codes?: string[]): Promise<FeatureEntity[]> {
    const queryBuilder = this.getRoleClaimsQueryBuilderByUserId(
      FeatureEntity,
      ROLE_CLAIM_TYPE_ENUM.FEATURE,
      userId,
    );
    if (codes) {
      queryBuilder.where('claims.code IN (:codes)', { codes: codes.join(',') });
    }
    return queryBuilder.getMany();
  }

  public getMenusByUserId(userId: number, groups?: string[]): Promise<MenuEntity[]> {
    const queryBuilder = this.getFeatureClaimQueryBuilderByUserId(
      MenuEntity,
      FEATURE_CLAIM_TYPE_ENUM.MENU,
      userId,
    );
    if (groups) {
      queryBuilder.where('claims.group IN (:groups)', { codes: groups.join(',') });
    }
    return queryBuilder.getMany();
  }

  public getPermissionsByUserId(userId: number, codes?: string[]): Promise<PermissionEntity[]> {
    const queryBuilder = this.getFeatureClaimQueryBuilderByUserId(
      PermissionEntity,
      FEATURE_CLAIM_TYPE_ENUM.PERMISSION,
      userId,
    );
    if (codes) {
      queryBuilder.where('claims.code IN (:codes)', { codes: codes.join(',') });
    }
    return queryBuilder.getMany();
  }

  public getActionsByUserId(
    userId: number,
    method: ACTION_METHOD_ENUM,
    path: string,
  ): Promise<ActionEntity[]> {
    const queryBuilder = this.getFeatureClaimQueryBuilderByUserId(
      ActionEntity,
      FEATURE_CLAIM_TYPE_ENUM.ACTION,
      userId,
    );
    if (method && path) {
      queryBuilder
        .andWhere('claims.method = :method', { method })
        .andWhere('claims.path = :path', { path });
    }
    return queryBuilder.getMany();
  }
}
