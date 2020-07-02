import { BusinessException, InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindConditions, Like } from 'typeorm';
import { CryptoUserService } from '../../crypto';
import { UserEntity } from '../entities';
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
      relations: ['roles'],
      order: { modifiedDate: 'DESC' },
      skip,
      take,
    });
    const userModels = this.mapper(users);
    return { data: userModels, count };
  }

  public async _getUsers(queries: QueryUserModel): Promise<UserModel[]> {
    const where = this.getWhere(queries);
    const users = await this.userRepositoryService.find({
      where,
      relations: ['roles'],
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
}
