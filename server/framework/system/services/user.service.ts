import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, FindConditions, Like } from 'typeorm';
import { CryptoUserService } from '../../crypto';
import {
  ActionEntity,
  RoleClaimEntity,
  RoleEntity,
  UserEntity,
  UserProviderEntity,
} from '../entities';
import { ACTION_METHOD_ENUM, ROLE_CLAIM_TYPE_ENUM, USER_PROVIDER_TYPE_ENUM } from '../enums';
import {
  CreatedUserModel,
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
    private readonly modelService: ModelService,
    private readonly cryptoUserService: CryptoUserService,
  ) {}

  private mapper(users: UserEntity[]): UserModel[];
  private mapper(user: UserEntity): UserModel;
  private mapper(userOrUsers: UserEntity[] | UserEntity): UserModel[] | UserModel {
    return this.modelService.mapper(UserModel, userOrUsers);
  }

  private getWhere(queries: QueryUserModel): FindConditions<UserEntity> {
    const where: FindConditions<UserEntity> = {};
    if (queries.username) {
      where.username = Like(queries.username);
    }
    if (queries.nickname) {
      where.nickname = Like(queries.nickname);
    }
    if (queries.realname) {
      where.realname = Like(queries.realname);
    }
    if (queries.phone) {
      where.phone = Like(queries.phone);
    }
    if (queries.phoneConfirmed) {
      where.phoneConfirmed = queries.phoneConfirmed;
    }
    if (queries.email) {
      where.email = Like(queries.email);
    }
    if (queries.emailConfirmed) {
      where.emailConfirmed = queries.emailConfirmed;
    }
    if (queries.comment) {
      where.comment = Like(queries.comment);
    }
    return where;
  }

  public async _getUsersAndCount(queries: QueryUserAndCountModel): Promise<UserAndCountModel> {
    const skip = (queries.pageNumber - 1) * queries.pageSize;
    const take = queries.pageSize;
    const where = this.getWhere(queries);
    const [users, count] = await this.userRepositoryService.findAndCount({
      where,
      order: { modifiedDate: 'DESC' },
      skip,
      take,
    });
    const userModels = this.mapper(users);
    return { users: userModels, count };
  }

  public async _getUsers(queries: QueryUserModel): Promise<UserModel[]> {
    const where = this.getWhere(queries);
    const users = await this.userRepositoryService.find({
      where,
      order: { modifiedDate: 'DESC' },
    });
    const userModels = this.mapper(users);
    return userModels;
  }

  public async _getUserById(id: number): Promise<UserModel> {
    const user = await this.getUserByIdOrFail(id);
    const userModel = this.mapper(user);
    return userModel;
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

  public async getLocalUserByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<UserModel | null> {
    const encodePassword = this.cryptoUserService.encodePassword(password);
    const user = await this.userRepositoryService.findOne({ username, password: encodePassword });
    if (!user) {
      return null;
    }
    return this.mapper(user);
  }

  public async getLocalUsers() {
    const users = await this.userRepositoryService
      .createQueryBuilder('users')
      .where(
        (subQuery) =>
          `id NOT IN ${subQuery
            .from(UserProviderEntity, 'userProviders')
            .select('userId')
            .groupBy('userId')}`,
      )
      .andWhere('isDeleted = 0')
      .getMany();
    return users;
  }

  public async getUsersByProviderType(type: USER_PROVIDER_TYPE_ENUM): Promise<UserEntity[]> {
    const users = await this.userRepositoryService
      .createQueryBuilder('users')
      .where(
        (subQuery) =>
          `id IN ${subQuery
            .from(UserProviderEntity, 'userProviders')
            .select('userId')
            .where('type = :type', { type })}`,
      )
      .andWhere('isDeleted = 0')
      .getMany();
    return users;
  }

  public async getRolesByUserId(id: number): Promise<RoleEntity[]> {
    const user = await this.userRepositoryService.findOne(id, { relations: ['roles'] });
    if (!user) {
      return [];
    }
    return user.roles!;
  }

  public async userActionValidator(
    userId: number,
    method: ACTION_METHOD_ENUM,
    path: string,
  ): Promise<boolean> {
    const action = await this.connection
      .getRepository(UserEntity)
      .createQueryBuilder('users')
      .innerJoin(
        '[system].[user-role-mapping]',
        'userRoleMappings',
        'userRoleMappings.UserId = users.Id',
      )
      .innerJoin(
        (subQuery) => subQuery.from(RoleEntity, 'roles').where('isDeleted = 0'),
        'roles',
        'roles.id = userRoleMappings.roleId',
      )
      .innerJoin(
        (subQuery) =>
          subQuery
            .from(RoleClaimEntity, 'roleClaims')
            .where('type = :type', { type: ROLE_CLAIM_TYPE_ENUM.ACTION }),
        'roleClaims',
        'roleClaims.roleId = roles.id',
      )
      .innerJoin(
        (subQuery) =>
          subQuery
            .from(ActionEntity, 'actions')
            .where('method = :method', { method })
            .andWhere('path = :path', { path })
            .andWhere('isDeleted = 0'),
        'actions',
        'actions.id = roleClaims.key',
      )
      .where('users.id = :userId', { userId })
      .getOne();
    return action ? true : false;
  }
}
