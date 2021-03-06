import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import _ from 'lodash';
import { Connection, FindConditions, In, Like, ObjectType } from 'typeorm';
import {
  ActionEntity,
  MenuEntity,
  PermissionEntity,
  RoleClaimEntity,
  RoleEntity,
} from '../entities';
import { ROLE_CLAIM_TYPE_ENUM } from '../enums';
import { IClaimColumnOptions, IRoleClaimOptions } from '../interfaces';
import {
  ActionModel,
  CreatedRoleModel,
  MenuModel,
  PermissionModel,
  QueryRoleAndCountModel,
  QueryRoleModel,
  RoleAndCountModel,
  RoleModel,
  UpdatedRoleModel,
} from '../models';
import { ClaimService } from './claim.service';
import { ModelService } from './model.service';

@Injectable()
export class RoleService {
  private readonly roleClaimColumnOptions: IClaimColumnOptions = {
    idField: 'roleId',
    typeField: 'type',
    keyField: 'key',
  };

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepositoryService(RoleEntity)
    private readonly roleRepositoryService: RepositoryService<RoleEntity>,
    @InjectRepositoryService(RoleClaimEntity)
    private readonly roleClaimRepositoryService: RepositoryService<RoleClaimEntity>,
    @InjectRepositoryService(MenuEntity)
    private readonly menuRepositoryService: RepositoryService<MenuEntity>,
    @InjectRepositoryService(PermissionEntity)
    private readonly permissionRepositoryService: RepositoryService<PermissionEntity>,
    @InjectRepositoryService(ActionEntity)
    private readonly actionRepositoryService: RepositoryService<ActionEntity>,
    private readonly modelService: ModelService,
    private readonly claimService: ClaimService,
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
    const roleModels = await this.getRoleModels(roles);
    return { data: roleModels, count };
  }

  public async _getRoles(queries: QueryRoleModel): Promise<RoleModel[]> {
    const where = this.getWhere(queries);
    const roles = await this.roleRepositoryService.find({
      where,
      order: { modifiedDate: 'DESC' },
    });
    const roleModels = await this.getRoleModels(roles);
    return roleModels;
  }

  public async _getRoleById(id: number): Promise<RoleModel> {
    const role = await this.getRoleByIdOrFail(id);
    const roleModel = this.mapper(role);
    return roleModel;
  }

  public async _createRole(createdRoleModel: CreatedRoleModel): Promise<RoleModel> {
    const role = await this.roleRepositoryService.insert(createdRoleModel);
    await this.createRoleClaimsByRoleId(role.id, {
      menus: { type: ROLE_CLAIM_TYPE_ENUM.MENU, collections: createdRoleModel.menus },
      permissions: {
        type: ROLE_CLAIM_TYPE_ENUM.PERMISSION,
        collections: createdRoleModel.permissions,
      },
      actions: { type: ROLE_CLAIM_TYPE_ENUM.ACTION, collections: createdRoleModel.actions },
    });
    const roleModel = this.mapper(role);
    return roleModel;
  }

  public async _updateRoleById(id: number, updatedRoleModel: UpdatedRoleModel): Promise<RoleModel> {
    const role = await this.roleRepositoryService.update(id, updatedRoleModel);
    if (!role) {
      throw new NotFoundException(`Not found system role by id "${id}"!`);
    }
    await this.createRoleClaimsByRoleId(role.id, {
      menus: { type: ROLE_CLAIM_TYPE_ENUM.MENU, collections: updatedRoleModel.menus },
      permissions: {
        type: ROLE_CLAIM_TYPE_ENUM.PERMISSION,
        collections: updatedRoleModel.permissions,
      },
      actions: { type: ROLE_CLAIM_TYPE_ENUM.ACTION, collections: updatedRoleModel.actions },
    });
    const roleModel = this.mapper(role);
    return roleModel;
  }

  public async _deleteRoleById(id: number): Promise<RoleModel> {
    const role = await this.roleRepositoryService.delete(id);
    if (!role) {
      throw new NotFoundException(`Not found role by id "${id}"!`);
    }
    await this.deleteRoleClaimsByRoleId(role.id, [
      ROLE_CLAIM_TYPE_ENUM.MENU,
      ROLE_CLAIM_TYPE_ENUM.PERMISSION,
      ROLE_CLAIM_TYPE_ENUM.ACTION,
    ]);
    const roleModel = this.mapper(role);
    return roleModel;
  }

  public createRoleClaimsByRoleId(
    roleId: number,
    options: IRoleClaimOptions,
  ): Promise<RoleClaimEntity[]> {
    return this.claimService.createClaimsById(
      this.roleClaimRepositoryService,
      roleId,
      options,
      this.roleClaimColumnOptions,
    );
  }

  public updateRoleClaimByRoleId(
    roleId: number,
    options: IRoleClaimOptions,
  ): Promise<RoleClaimEntity[]> {
    return this.claimService.updateClaimById(
      this.roleClaimRepositoryService,
      roleId,
      options,
      this.roleClaimColumnOptions,
    );
  }

  public deleteRoleClaimsByRoleId(
    roleId: number,
    types: ROLE_CLAIM_TYPE_ENUM[],
  ): Promise<RoleClaimEntity[]> {
    return this.claimService.deleteClaimsById(
      this.roleClaimRepositoryService,
      roleId,
      types,
      this.roleClaimColumnOptions,
    );
  }

  public async getRoleModels(roles: RoleEntity[]): Promise<RoleModel[]> {
    if (roles.length === 0) {
      return [];
    }
    const roleIds = _.map(roles, 'id');
    const claims = await this.roleClaimRepositoryService.find({
      type: In([
        ROLE_CLAIM_TYPE_ENUM.MENU,
        ROLE_CLAIM_TYPE_ENUM.PERMISSION,
        ROLE_CLAIM_TYPE_ENUM.ACTION,
      ]),
      roleId: In(roleIds),
    });
    if (claims.length === 0) {
      return this.mapper(roles);
    }
    const menuIds: number[] = [];
    const permissionIds: number[] = [];
    const actionIds: number[] = [];
    _.each(claims, (claim) => {
      switch (claim.type) {
        case ROLE_CLAIM_TYPE_ENUM.MENU:
          menuIds.push(_.toNumber(claim.key));
          break;
        case ROLE_CLAIM_TYPE_ENUM.PERMISSION:
          permissionIds.push(_.toNumber(claim.key));
          break;
        case ROLE_CLAIM_TYPE_ENUM.ACTION:
          actionIds.push(_.toNumber(claim.key));
          break;
        default:
          break;
      }
    });
    const [menus, permissions, actions] = await Promise.all([
      this.menuRepositoryService.findByIds(menuIds),
      this.permissionRepositoryService.findByIds(permissionIds),
      this.actionRepositoryService.findByIds(actionIds),
    ]);
    const [roleModels, menuModels, permissionModels, actionModels] = [
      this.mapper(roles),
      this.modelService.mapper(MenuModel, menus),
      this.modelService.mapper(PermissionModel, permissions),
      this.modelService.mapper(ActionModel, actions),
    ];
    _.forEach(roleModels, (roleModel) => {
      const roleMenus: MenuModel[] = [];
      const rolePermissions: PermissionModel[] = [];
      const roleActions: ActionModel[] = [];
      _.chain(claims)
        .filter({ roleId: roleModel.id })
        .each((claim) => {
          switch (claim.type) {
            case ROLE_CLAIM_TYPE_ENUM.MENU:
              const menuModel = _.find(menuModels, { id: _.toNumber(claim.key) });
              if (menuModel) {
                roleMenus.push(menuModel);
              }
              break;
            case ROLE_CLAIM_TYPE_ENUM.PERMISSION:
              const permissionModel = _.find(permissionModels, { id: _.toNumber(claim.key) });
              if (permissionModel) {
                rolePermissions.push(permissionModel);
              }
              break;
            case ROLE_CLAIM_TYPE_ENUM.ACTION:
              const actionModel = _.find(actionModels, { id: _.toNumber(claim.key) });
              if (actionModel) {
                roleActions.push(actionModel);
              }
              break;
            default:
              break;
          }
        })
        .value();
      roleModel.menus = roleMenus;
      roleModel.permissions = rolePermissions;
      roleModel.actions = roleActions;
    });
    return roleModels;
  }

  public async getRoleByIdOrFail(id: number): Promise<RoleEntity> {
    const role = await this.roleRepositoryService.findOne({ id });
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

  public async getPermissionsByRoleCode(code: string) {
    const menus = await this.getClaimsByRoleConditions(
      PermissionEntity,
      ROLE_CLAIM_TYPE_ENUM.PERMISSION,
      { code },
    );
    return menus;
  }

  public async getPermissionsByRoleId(id: number) {
    const menus = await this.getClaimsByRoleConditions(
      PermissionEntity,
      ROLE_CLAIM_TYPE_ENUM.PERMISSION,
      { id },
    );
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
