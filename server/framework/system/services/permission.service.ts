import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindConditions, Like } from 'typeorm';
import { PermissionEntity } from '../entities';
import {
  CreatedPermissionModel,
  PermissionAndCountModel,
  PermissionModel,
  QueryPermissionAndCountModel,
  QueryPermissionModel,
  UpdatedPermissionModel,
} from '../models';
import { ModelService } from './model.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepositoryService(PermissionEntity)
    private readonly permissionRepositoryService: RepositoryService<PermissionEntity>,
    private readonly modelService: ModelService,
  ) {}

  private mapper(permissions: PermissionEntity[]): PermissionModel[];
  private mapper(permission: PermissionEntity): PermissionModel;
  private mapper(
    permissionOrPermissions: PermissionEntity[] | PermissionEntity,
  ): PermissionModel[] | PermissionModel {
    return this.modelService.mapper(PermissionModel, permissionOrPermissions);
  }

  private getWhere(queries: QueryPermissionModel): FindConditions<PermissionEntity> {
    const where: FindConditions<PermissionEntity> = {};
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

  public async _getPermissionsAndCount(
    queries: QueryPermissionAndCountModel,
  ): Promise<PermissionAndCountModel> {
    const skip = (queries.pageNumber - 1) * queries.pageSize;
    const take = queries.pageSize;
    const where = this.getWhere(queries);
    const [permissions, count] = await this.permissionRepositoryService.findAndCount({
      where,
      order: { modifiedDate: 'DESC' },
      skip,
      take,
    });
    const permissionModels = this.mapper(permissions);
    return { data: permissionModels, count };
  }

  public async _getPermissions(queries: QueryPermissionModel): Promise<PermissionModel[]> {
    const where = this.getWhere(queries);
    const permissions = await this.permissionRepositoryService.find({
      where,
      order: { modifiedDate: 'DESC' },
    });
    const permissionModels = this.mapper(permissions);
    return permissionModels;
  }

  public async _getPermissionById(id: number): Promise<PermissionModel> {
    const permission = await this.getPermissionByIdOrFail(id);
    const permissionModel = this.mapper(permission);
    return permissionModel;
  }

  public async _createPermission(
    createdPermissionModel: CreatedPermissionModel,
  ): Promise<PermissionModel> {
    const permission = await this.permissionRepositoryService.insert(createdPermissionModel);
    const permissionModel = this.mapper(permission);
    return permissionModel;
  }

  public async _updatePermissionById(
    id: number,
    updatedPermissionModel: UpdatedPermissionModel,
  ): Promise<PermissionModel> {
    const permission = await this.permissionRepositoryService.update(id, updatedPermissionModel);
    if (!permission) {
      throw new NotFoundException(`Not found system permission by id "${id}"!`);
    }
    const permissionModel = this.mapper(permission);
    return permissionModel;
  }

  public async _deletePermissionById(id: number): Promise<PermissionModel> {
    const permission = await this.permissionRepositoryService.delete(id);
    if (!permission) {
      throw new NotFoundException(`Not found permission by id "${id}"!`);
    }
    const permissionModel = this.mapper(permission);
    return permissionModel;
  }

  public async getPermissionByIdOrFail(id: number): Promise<PermissionEntity> {
    const permission = await this.permissionRepositoryService.findOne({ id });
    if (!permission) {
      throw new NotFoundException(`Not found system permission by id "${id}"!`);
    }
    return permission;
  }

  public async getPermissionByCodeOrFail(code: string): Promise<PermissionEntity> {
    const permission = await this.permissionRepositoryService.findOne({ code });
    if (!permission) {
      throw new NotFoundException(`Not found system permission by code "${code}"!`);
    }
    return permission;
  }
}
