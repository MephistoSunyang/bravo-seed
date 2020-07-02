import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { FindConditions, In, Like } from 'typeorm';
import { FeatureEntity, RoleClaimEntity, RoleEntity } from '../entities';
import { ROLE_CLAIM_TYPE_ENUM } from '../enums';
import {
  CreatedRoleModel,
  FeatureModel,
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
    @InjectRepositoryService(RoleEntity)
    private readonly roleRepositoryService: RepositoryService<RoleEntity>,
    @InjectRepositoryService(RoleClaimEntity)
    private readonly roleClaimRepositoryService: RepositoryService<RoleClaimEntity>,
    @InjectRepositoryService(FeatureEntity)
    private readonly featureRepositoryService: RepositoryService<FeatureEntity>,
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

  private getRoleClaimModels(
    roleId: number,
    type: ROLE_CLAIM_TYPE_ENUM,
    claims?: { id: number }[],
  ): RoleClaimEntity[] {
    const featureClaimModels =
      claims && claims.length !== 0
        ? _.map(claims, (claim) =>
            this.roleClaimRepositoryService.create({
              type,
              key: _.toString(claim.id),
              roleId,
            }),
          )
        : [];
    return featureClaimModels;
  }

  private createRoleClaimsByRoleId(
    featureId: number,
    features?: FeatureModel[],
  ): Promise<RoleClaimEntity[]> {
    const featureClaimModels = _.concat(
      this.getRoleClaimModels(featureId, ROLE_CLAIM_TYPE_ENUM.FEATURE, features),
    );
    return this.roleClaimRepositoryService.insertBulk(featureClaimModels);
  }

  private deleteRoleClaimsByRoleId(roleId: number): Promise<RoleClaimEntity[]> {
    return this.roleClaimRepositoryService.deleteBulk({
      type: In([ROLE_CLAIM_TYPE_ENUM.FEATURE]),
      roleId,
    });
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
    await this.createRoleClaimsByRoleId(role.id, createdRoleModel.features);
    const roleModel = this.mapper(role);
    return roleModel;
  }

  public async _updateRoleById(id: number, updatedRoleModel: UpdatedRoleModel): Promise<RoleModel> {
    const role = await this.roleRepositoryService.update(id, updatedRoleModel);
    if (!role) {
      throw new NotFoundException(`Not found system role by id "${id}"!`);
    }
    await this.deleteRoleClaimsByRoleId(id);
    await this.createRoleClaimsByRoleId(role.id, updatedRoleModel.features);
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

  public async getRoleModels(roles: RoleEntity[]): Promise<RoleModel[]> {
    if (roles.length === 0) {
      return [];
    }
    const roleIds = _.map(roles, 'id');
    const claims = await this.roleClaimRepositoryService.find({
      type: In([ROLE_CLAIM_TYPE_ENUM.FEATURE]),
      roleId: In(roleIds),
    });
    if (claims.length === 0) {
      return this.mapper(roles);
    }
    const [featureIds] = [
      _.chain(claims)
        .filter({ type: ROLE_CLAIM_TYPE_ENUM.FEATURE })
        .map((claim) => _.toNumber(claim.key))
        .value(),
    ];
    const [features] = await Promise.all([this.featureRepositoryService.findByIds(featureIds)]);
    const [roleModels, featureModels] = [
      this.mapper(roles),
      this.modelService.mapper(FeatureModel, features),
    ];
    _.forEach(roleModels, (roleModel) => {
      const roleFeatureIds = _.chain(claims)
        .filter({ type: ROLE_CLAIM_TYPE_ENUM.FEATURE, roleId: roleModel.id })
        .map((claim) => _.toNumber(claim.key))
        .value();
      const roleFeatures = _.chain(featureModels)
        .filter((featureModel) => _.includes(roleFeatureIds, featureModel.id))
        .value();
      roleModel.features = roleFeatures;
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
}
