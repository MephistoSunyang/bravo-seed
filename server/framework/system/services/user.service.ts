import { BusinessException, InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import _ from 'lodash';
import { Connection, ObjectType, SelectQueryBuilder } from 'typeorm';
import { CryptoUserService } from '../../crypto';
import {
  ActionEntity,
  MenuEntity,
  PermissionEntity,
  RoleClaimEntity,
  RoleEntity,
  UserEntity,
  UserProviderEntity,
} from '../entities';
import { ACTION_METHOD_ENUM, ROLE_CLAIM_TYPE_ENUM } from '../enums';
import {
  CreatedUserModel,
  CreateUserPasswordModel,
  MenuModel,
  QueryCurrentUserMenuModel,
  QueryUserAndCountModel,
  QueryUserModel,
  ReplaceUserPasswordModel,
  UpdatedUserModel,
  UserAndCountModel,
  UserModel,
  UserProviderModel,
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
      roleId,
    } = queries;
    const usersQueryBuilder = this.userRepositoryService
      .createQueryBuilder('users')
      .leftJoinAndMapMany(
        'users.providers',
        UserProviderEntity,
        'providers',
        'providers.userId = users.id',
      )
      .leftJoin('user-role-mappings', 'userRoleMappings', 'userRoleMappings.userId = users.id')
      .leftJoinAndMapMany('users.roles', RoleEntity, 'roles', 'roles.id = userRoleMappings.roleId')
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
    if (roleId) {
      usersQueryBuilder.andWhere('roles.id = :roleId', { roleId });
    }
    usersQueryBuilder.orderBy('users.modifiedDate', 'DESC');
    return usersQueryBuilder;
  }

  private async updateUserProviders(
    userId: number,
    providerModels: UserProviderModel[],
  ): Promise<UserProviderEntity[]> {
    if (providerModels.length === 0) {
      return [];
    }
    await this.userProviderRepositoryService.deleteBulk({ userId });
    const userProviderModels = _.map(providerModels, (providerModel) =>
      this.userProviderRepositoryService.merge(providerModel, { userId }),
    );
    const userProviders = await this.userProviderRepositoryService.insertBulk(userProviderModels);
    return userProviders;
  }

  private async getUserModels(users: UserEntity[]): Promise<UserModel[]> {
    if (users.length === 0) {
      return [];
    }
    const userModels = this.mapper(users);
    _.each(userModels, (userModel) => {
      const user = _.find(users, { id: userModel.id });
      userModel.hasPassword = user && user.password ? true : false;
    });
    return userModels;
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
    const providerModels = createdUserModel.providers ? createdUserModel.providers : [];
    createdUserModel.providers = undefined;
    const model = this.userRepositoryService.merge(createdUserModel);
    const user = await this.userRepositoryService.insert(model);
    await this.updateUserProviders(user.id, providerModels);
    const userModel = this.mapper(user);
    return userModel;
  }

  public async _updateUserById(id: number, updatedUserModel: UpdatedUserModel): Promise<UserModel> {
    const providerModels = updatedUserModel.providers ? updatedUserModel.providers : [];
    updatedUserModel.providers = undefined;
    const user = await this.userRepositoryService.update(id, updatedUserModel);
    if (!user) {
      throw new NotFoundException(`Not found system user by id "${id}"!`);
    }
    await this.updateUserProviders(id, providerModels);
    const userModel = this.mapper(user);
    return userModel;
  }

  public async _createUserPassword(
    id: number,
    createUserPasswordModel: CreateUserPasswordModel,
  ): Promise<UserModel> {
    const { password } = createUserPasswordModel;
    const encodePassword = this.cryptoUserService.encodePassword(password);
    const updatedUser = await this.userRepositoryService.update(id, {
      password: encodePassword,
    });
    const userModel = this.mapper(updatedUser!);
    return userModel;
  }

  public async _replaceUserPassword(
    id: number,
    replaceUserPasswordModel: ReplaceUserPasswordModel,
  ): Promise<UserModel> {
    const { password, newPassword } = replaceUserPasswordModel;
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

  public getMenusByUserId(userId: number, groups?: string[]): Promise<MenuEntity[]> {
    const queryBuilder = this.getRoleClaimsQueryBuilderByUserId(
      MenuEntity,
      ROLE_CLAIM_TYPE_ENUM.MENU,
      userId,
    );
    if (groups) {
      queryBuilder.where('claims.group IN (:groups)', { codes: groups.join(',') });
    }
    return queryBuilder.getMany();
  }

  public getPermissionsByUserId(userId: number, codes?: string[]): Promise<PermissionEntity[]> {
    const queryBuilder = this.getRoleClaimsQueryBuilderByUserId(
      PermissionEntity,
      ROLE_CLAIM_TYPE_ENUM.PERMISSION,
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
    const queryBuilder = this.getRoleClaimsQueryBuilderByUserId(
      ActionEntity,
      ROLE_CLAIM_TYPE_ENUM.ACTION,
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
