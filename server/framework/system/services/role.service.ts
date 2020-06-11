import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import _ from 'lodash';
import { Connection, FindConditions, Like, ObjectType } from 'typeorm';
import { ActionEntity, MenuEntity, RoleClaimEntity, RoleEntity } from '../entities';
import { ROLE_CLAIM_TYPE_ENUM } from '../enums';
import {
  CreatedRoleModel,
  QueryRoleAndCountModel,
  QueryRoleModel,
  RoleAndCountModel,
  RoleModel,
  UpdatedRoleModel,
} from '../models';
import { ModelService } from './model.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepositoryService(RoleEntity)
    private readonly roleRepositoryService: RepositoryService<RoleEntity>,
    private readonly modelService: ModelService,
  ) {}

  private mapper(roles: RoleEntity[]): RoleModel[];
  private mapper(role: RoleEntity): RoleModel;
  private mapper(roleOrRoles: RoleEntity[] | RoleEntity): RoleModel[] | RoleModel {
    return this.modelService.mapper(RoleModel, roleOrRoles);
  }

  private getWhere(queries: QueryRoleModel): FindConditions<RoleEntity> {
    const where: FindConditions<RoleEntity> = {};
    if (queries.roleGroupId) {
      where.roleGroupId = queries.roleGroupId;
    }
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

  public async _getRolesAndCount(queries: QueryRoleAndCountModel): Promise<RoleAndCountModel> {
    const skip = (queries.pageNumber - 1) * queries.pageSize;
    const take = queries.pageSize;
    const where = this.getWhere(queries);
    const [roles, count] = await this.roleRepositoryService.findAndCount({
      where,
      order: { modifiedDate: 'DESC' },
      skip,
      take,
    });
    const roleModels = this.mapper(roles);
    return { roles: roleModels, count };
  }

  public async _getRoles(queries: QueryRoleModel): Promise<RoleModel[]> {
    const where = this.getWhere(queries);
    const roles = await this.roleRepositoryService.find({
      where,
      order: { modifiedDate: 'DESC' },
    });
    const roleModels = this.mapper(roles);
    return roleModels;
  }

  public async _getRoleById(id: number): Promise<RoleModel> {
    const role = await this.getRoleByIdOrFail(id);
    const roleModel = this.mapper(role);
    return roleModel;
  }

  public async _createRole(createdRoleModel: CreatedRoleModel): Promise<RoleModel> {
    const role = await this.roleRepositoryService.insert(createdRoleModel);
    const roleModel = this.mapper(role);
    return roleModel;
  }

  public async _updateRoleById(id: number, updatedRoleModel: UpdatedRoleModel): Promise<RoleModel> {
    const role = await this.roleRepositoryService.update(id, updatedRoleModel);
    if (!role) {
      throw new NotFoundException(`Not found system role by id "${id}"!`);
    }
    const roleModel = this.mapper(role);
    return roleModel;
  }

  public async _deleteRoleById(id: number): Promise<RoleModel> {
    const role = await this.roleRepositoryService.delete(id);
    if (!role) {
      throw new NotFoundException(`Not found role by id "${id}"!`);
    }
    const roleModel = this.mapper(role);
    return roleModel;
  }

  public async getRoleByIdOrFail(id: number): Promise<RoleEntity> {
    const role = await this.roleRepositoryService.findOne(id);
    if (!role) {
      throw new NotFoundException(`Not found system role by id "${id}"!`);
    }
    return role;
  }

  public async getRoleByCodeOrFail(code: string): Promise<RoleEntity> {
    const role = await this.roleRepositoryService.findOne({ code });
    if (!role) {
      throw new NotFoundException(`Not found system role by code "${code}"!`);
    }
    return role;
  }

  public async getClaimsByRoleConditions<IEntity>(
    entity: ObjectType<IEntity>,
    roleClaimType: ROLE_CLAIM_TYPE_ENUM,
    conditions: FindConditions<RoleEntity>,
  ): Promise<IEntity[]> {
    const roles = await this.roleRepositoryService.find(conditions);
    if (roles.length === 0) {
      return [];
    }
    const roleIds = _.map(roles, 'id');
    const repository = this.connection.getRepository(entity);
    const query = repository
      .createQueryBuilder('claims')
      .innerJoin(
        (subQuery) =>
          subQuery
            .from(RoleClaimEntity, 'roleClaims')
            .where('type = :type', { type: roleClaimType }),
        'roleClaims',
        'roleClaims.key = claims.id',
      )
      .innerJoin(
        (subQuery) =>
          subQuery.from(RoleEntity, 'roles').whereInIds(roleIds).andWhere('isDeleted = 0'),
        'roles',
        'roles.id = roleClaims.roleId',
      );
    if (repository.metadata.deleteColumn) {
      query.where(`${repository.metadata.deleteColumn.databaseName} = 0`);
    }
    const claims = await query.getMany();
    return claims;
  }

  public async getMenusByRoleId(id: number) {
    const menus = await this.getClaimsByRoleConditions(MenuEntity, ROLE_CLAIM_TYPE_ENUM.MENU, {
      id,
    });
    return menus;
  }

  public async getMenusByRoleCode(code: string) {
    const menus = await this.getClaimsByRoleConditions(MenuEntity, ROLE_CLAIM_TYPE_ENUM.MENU, {
      code,
    });
    return menus;
  }

  public async getActionsByRoleId(id: number) {
    const actions = await this.getClaimsByRoleConditions(
      ActionEntity,
      ROLE_CLAIM_TYPE_ENUM.ACTION,
      { id },
    );
    return actions;
  }

  public async getActionsByRoleCode(code: string) {
    const actions = await this.getClaimsByRoleConditions(
      ActionEntity,
      ROLE_CLAIM_TYPE_ENUM.ACTION,
      { code },
    );
    return actions;
  }
}
