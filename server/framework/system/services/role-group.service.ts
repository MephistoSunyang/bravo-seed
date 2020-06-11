import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindConditions, Like } from 'typeorm';
import { RoleEntity, RoleGroupEntity } from '../entities';
import {
  CreatedRoleGroupModel,
  QueryRoleGroupAndCountModel,
  QueryRoleGroupModel,
  RoleGroupAndCountModel,
  RoleGroupModel,
  UpdatedRoleGroupModel,
} from '../models';
import { ModelService } from './model.service';

@Injectable()
export class RoleGroupService {
  constructor(
    @InjectRepositoryService(RoleGroupEntity)
    private readonly roleGroupRepositoryService: RepositoryService<RoleGroupEntity>,
    @InjectRepositoryService(RoleEntity)
    private readonly roleRepositoryService: RepositoryService<RoleEntity>,
    private readonly modelService: ModelService,
  ) {}

  private mapper(roleGroups: RoleGroupEntity[]): RoleGroupModel[];
  private mapper(roleGroup: RoleGroupEntity): RoleGroupModel;
  private mapper(
    roleGroupOrRoleGroups: RoleGroupEntity[] | RoleGroupEntity,
  ): RoleGroupModel[] | RoleGroupModel {
    return this.modelService.mapper(RoleGroupModel, roleGroupOrRoleGroups);
  }

  private getWhere(queries: QueryRoleGroupModel): FindConditions<RoleGroupEntity> {
    const where: FindConditions<RoleGroupEntity> = {};
    if (queries.code) {
      where.code = Like(queries.code);
    }
    if (queries.name) {
      where.name = Like(queries.name);
    }
    if (queries.comment) {
      where.comment = Like(queries.comment);
    }
    return where;
  }

  public async _getRoleGroupsAndCount(
    queries: QueryRoleGroupAndCountModel,
  ): Promise<RoleGroupAndCountModel> {
    const skip = (queries.pageNumber - 1) * queries.pageSize;
    const take = queries.pageSize;
    const where = this.getWhere(queries);
    const [roleGroups, count] = await this.roleGroupRepositoryService.findAndCount({
      where,
      order: { modifiedDate: 'DESC' },
      skip,
      take,
    });
    const roleGroupModels = this.mapper(roleGroups);
    return { roleGroups: roleGroupModels, count };
  }

  public async _getRoleGroups(queries: QueryRoleGroupModel): Promise<RoleGroupModel[]> {
    const where = this.getWhere(queries);
    const roleGroups = await this.roleGroupRepositoryService.find({
      where,
      order: { modifiedDate: 'DESC' },
    });
    const roleGroupModels = this.mapper(roleGroups);
    return roleGroupModels;
  }

  public async _getRoleGroupById(id: number): Promise<RoleGroupModel> {
    const roleGroup = await this.getRoleGroupByIdOrFail(id);
    const roleGroupModel = this.mapper(roleGroup);
    return roleGroupModel;
  }

  public async _createRoleGroup(
    createdRoleGroupModel: CreatedRoleGroupModel,
  ): Promise<RoleGroupModel> {
    const roleGroup = await this.roleGroupRepositoryService.insert(createdRoleGroupModel);
    const roleGroupModel = this.mapper(roleGroup);
    return roleGroupModel;
  }

  public async _updateRoleGroupById(
    id: number,
    updatedRoleGroupModel: UpdatedRoleGroupModel,
  ): Promise<RoleGroupModel> {
    const roleGroup = await this.roleGroupRepositoryService.update(id, updatedRoleGroupModel);
    if (!roleGroup) {
      throw new NotFoundException(`Not found system roleGroup by id "${id}"!`);
    }
    const roleGroupModel = this.mapper(roleGroup);
    return roleGroupModel;
  }

  public async _deleteRoleGroupById(id: number): Promise<RoleGroupModel> {
    const roleGroup = await this.roleGroupRepositoryService.delete(id);
    if (!roleGroup) {
      throw new NotFoundException(`Not found roleGroup by id "${id}"!`);
    }
    const roleGroupModel = this.mapper(roleGroup);
    return roleGroupModel;
  }

  public async getRoleGroupByIdOrFail(id: number): Promise<RoleGroupEntity> {
    const roleGroup = await this.roleGroupRepositoryService.findOne(id);
    if (!roleGroup) {
      throw new NotFoundException(`Not found system roleGroup by id "${id}"!`);
    }
    return roleGroup;
  }

  public async getRoleGroupByCodeOrFail(code: string): Promise<RoleGroupEntity> {
    const roleGroup = await this.roleGroupRepositoryService.findOne({ code });
    if (!roleGroup) {
      throw new NotFoundException(`Not found system roleGroup by code "${code}"!`);
    }
    return roleGroup;
  }

  public async getRolesByRoleGroupId(id: number): Promise<RoleEntity[]> {
    const roles = await this.roleRepositoryService.find({ roleGroupId: id });
    return roles;
  }

  public async getRolesByRoleGroupCode(code: string): Promise<RoleEntity[]> {
    const roles = await this.roleRepositoryService.find({ code });
    return roles;
  }
}
