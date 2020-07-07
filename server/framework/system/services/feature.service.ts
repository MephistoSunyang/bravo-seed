import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { FindConditions, In, Like } from 'typeorm';
import {
  ActionEntity,
  FeatureClaimEntity,
  FeatureEntity,
  MenuEntity,
  PermissionEntity,
} from '../entities';
import { FEATURE_CLAIM_TYPE_ENUM } from '../enums';
import { IClaimColumnOptions, IFeatureClaimOptions } from '../interfaces';
import {
  ActionModel,
  CreatedFeatureModel,
  FeatureAndCountModel,
  FeatureModel,
  MenuModel,
  PermissionModel,
  QueryFeatureAndCountModel,
  QueryFeatureModel,
  UpdatedFeatureModel,
} from '../models';
import { ClaimService } from './claim.service';
import { ModelService } from './model.service';

@Injectable()
export class FeatureService {
  private readonly featureClaimColumnOptions: IClaimColumnOptions = {
    idField: 'featureId',
    typeField: 'type',
    keyField: 'key',
  };

  constructor(
    @InjectRepositoryService(FeatureEntity)
    private readonly featureRepositoryService: RepositoryService<FeatureEntity>,
    @InjectRepositoryService(FeatureClaimEntity)
    private readonly featureClaimRepositoryService: RepositoryService<FeatureClaimEntity>,
    @InjectRepositoryService(MenuEntity)
    private readonly menuRepositoryService: RepositoryService<MenuEntity>,
    @InjectRepositoryService(PermissionEntity)
    private readonly permissionRepositoryService: RepositoryService<PermissionEntity>,
    @InjectRepositoryService(ActionEntity)
    private readonly actionRepositoryService: RepositoryService<ActionEntity>,
    private readonly modelService: ModelService,
    private readonly claimService: ClaimService,
  ) {}

  private mapper(features: FeatureEntity[]): FeatureModel[];
  private mapper(feature: FeatureEntity): FeatureModel;
  private mapper(
    featureOrFeatures: FeatureEntity[] | FeatureEntity,
  ): FeatureModel[] | FeatureModel {
    return this.modelService.mapper(FeatureModel, featureOrFeatures);
  }

  private getWhere(queries: QueryFeatureModel): FindConditions<FeatureEntity> {
    const where: FindConditions<FeatureEntity> = {};
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

  // private getFeatureClaimModels(
  //   featureId: number,
  //   type: FEATURE_CLAIM_TYPE_ENUM,
  //   claims?: { id: number }[],
  // ): FeatureClaimEntity[] {
  //   const featureClaimModels =
  //     claims && claims.length !== 0
  //       ? _.map(claims, (claim) =>
  //           this.featureClaimRepositoryService.create({
  //             type,
  //             key: _.toString(claim.id),
  //             featureId,
  //           }),
  //         )
  //       : [];
  //   return featureClaimModels;
  // }

  // private createFeatureClaimsByFeatureId(
  //   featureId: number,
  //   menus?: MenuModel[],
  //   permissions?: PermissionModel[],
  //   actions?: ActionModel[],
  // ): Promise<FeatureClaimEntity[]> {
  //   const featureClaimModels = _.concat(
  //     this.getFeatureClaimModels(featureId, FEATURE_CLAIM_TYPE_ENUM.MENU, menus),
  //     this.getFeatureClaimModels(featureId, FEATURE_CLAIM_TYPE_ENUM.PERMISSION, permissions),
  //     this.getFeatureClaimModels(featureId, FEATURE_CLAIM_TYPE_ENUM.ACTION, actions),
  //   );
  //   return this.featureClaimRepositoryService.insertBulk(featureClaimModels);
  // }

  // private deleteFeatureClaimsByFeatureId(featureId: number): Promise<FeatureClaimEntity[]> {
  //   return this.featureClaimRepositoryService.deleteBulk({
  //     type: In([
  //       FEATURE_CLAIM_TYPE_ENUM.MENU,
  //       FEATURE_CLAIM_TYPE_ENUM.PERMISSION,
  //       FEATURE_CLAIM_TYPE_ENUM.ACTION,
  //     ]),
  //     featureId,
  //   });
  // }

  public async _getFeaturesAndCount(
    queries: QueryFeatureAndCountModel,
  ): Promise<FeatureAndCountModel> {
    const skip = (queries.pageNumber - 1) * queries.pageSize;
    const take = queries.pageSize;
    const where = this.getWhere(queries);
    const [features, count] = await this.featureRepositoryService.findAndCount({
      where,
      order: { modifiedDate: 'DESC' },
      skip,
      take,
    });
    const featureModels = await this.getFeatureModels(features);
    return { data: featureModels, count };
  }

  public async _getFeatures(queries: QueryFeatureModel): Promise<FeatureModel[]> {
    const where = this.getWhere(queries);
    const features = await this.featureRepositoryService.find({
      where,
      order: { modifiedDate: 'DESC' },
    });
    const featureModels = await this.getFeatureModels(features);
    return featureModels;
  }

  public async _getFeatureById(id: number): Promise<FeatureModel> {
    const feature = await this.getFeatureByIdOrFail(id);
    const featureModel = this.mapper(feature);
    return featureModel;
  }

  public async _createFeature(createdFeatureModel: CreatedFeatureModel): Promise<FeatureModel> {
    const feature = await this.featureRepositoryService.insert(createdFeatureModel);
    await this.createFeatureClaimsByFeatureId(feature.id, {
      menus: { type: FEATURE_CLAIM_TYPE_ENUM.MENU, collections: createdFeatureModel.menus },
      permissions: {
        type: FEATURE_CLAIM_TYPE_ENUM.PERMISSION,
        collections: createdFeatureModel.permissions,
      },
      actions: {
        type: FEATURE_CLAIM_TYPE_ENUM.ACTION,
        collections: createdFeatureModel.actions,
      },
      id: {
        type: FEATURE_CLAIM_TYPE_ENUM.ACTION,
        collections: 0,
      },
    });
    const featureModel = this.mapper(feature);
    return featureModel;
  }

  public async _updateFeatureById(
    id: number,
    updatedFeatureModel: UpdatedFeatureModel,
  ): Promise<FeatureModel> {
    const feature = await this.featureRepositoryService.update(id, updatedFeatureModel);
    if (!feature) {
      throw new NotFoundException(`Not found system feature by id "${id}"!`);
    }
    await this.createFeatureClaimsByFeatureId(feature.id, {
      menus: { type: FEATURE_CLAIM_TYPE_ENUM.MENU, collections: updatedFeatureModel.menus },
      permissions: {
        type: FEATURE_CLAIM_TYPE_ENUM.PERMISSION,
        collections: updatedFeatureModel.permissions,
      },
      actions: { type: FEATURE_CLAIM_TYPE_ENUM.ACTION, collections: updatedFeatureModel.actions },
    });
    const featureModel = this.mapper(feature);
    return featureModel;
  }

  public async _deleteFeatureById(id: number): Promise<FeatureModel> {
    const feature = await this.featureRepositoryService.delete(id);
    if (!feature) {
      throw new NotFoundException(`Not found feature by id "${id}"!`);
    }
    await this.deleteFeatureClaimsByFeatureId(feature.id, [
      FEATURE_CLAIM_TYPE_ENUM.MENU,
      FEATURE_CLAIM_TYPE_ENUM.PERMISSION,
      FEATURE_CLAIM_TYPE_ENUM.ACTION,
    ]);
    const featureModel = this.mapper(feature);
    return featureModel;
  }

  public createFeatureClaimsByFeatureId(
    featureId: number,
    options: IFeatureClaimOptions,
  ): Promise<FeatureClaimEntity[]> {
    return this.claimService.createClaimsById(
      this.featureClaimRepositoryService,
      featureId,
      options,
      this.featureClaimColumnOptions,
    );
  }

  public updateFeatureClaimByFeatureId(
    featureId: number,
    options: IFeatureClaimOptions,
  ): Promise<FeatureClaimEntity[]> {
    return this.claimService.updateClaimById(
      this.featureClaimRepositoryService,
      featureId,
      options,
      this.featureClaimColumnOptions,
    );
  }

  public deleteFeatureClaimsByFeatureId(
    featureId: number,
    types: FEATURE_CLAIM_TYPE_ENUM[],
  ): Promise<FeatureClaimEntity[]> {
    return this.claimService.deleteClaimsById(
      this.featureClaimRepositoryService,
      featureId,
      types,
      this.featureClaimColumnOptions,
    );
  }

  public async getFeatureModels(features: FeatureEntity[]): Promise<FeatureModel[]> {
    if (features.length === 0) {
      return [];
    }
    const featureIds = _.map(features, 'id');
    const claims = await this.featureClaimRepositoryService.find({
      type: In([
        FEATURE_CLAIM_TYPE_ENUM.MENU,
        FEATURE_CLAIM_TYPE_ENUM.PERMISSION,
        FEATURE_CLAIM_TYPE_ENUM.ACTION,
      ]),
      featureId: In(featureIds),
    });
    if (claims.length === 0) {
      return this.mapper(features);
    }
    const [menuIds, permissionIds, actionIds] = [
      _.chain(claims)
        .filter({ type: FEATURE_CLAIM_TYPE_ENUM.MENU })
        .map((claim) => _.toNumber(claim.key))
        .value(),
      _.chain(claims)
        .filter({ type: FEATURE_CLAIM_TYPE_ENUM.PERMISSION })
        .map((claim) => _.toNumber(claim.key))
        .value(),
      _.chain(claims)
        .filter({ type: FEATURE_CLAIM_TYPE_ENUM.ACTION })
        .map((claim) => _.toNumber(claim.key))
        .value(),
    ];
    const [menus, permissions, actions] = await Promise.all([
      this.menuRepositoryService.findByIds(menuIds),
      this.permissionRepositoryService.findByIds(permissionIds),
      this.actionRepositoryService.findByIds(actionIds),
    ]);
    const [featureModels, menuModels, permissionModels, actionModels] = [
      this.mapper(features),
      this.modelService.mapper(MenuModel, menus),
      this.modelService.mapper(PermissionModel, permissions),
      this.modelService.mapper(ActionModel, actions),
    ];
    _.forEach(featureModels, (featureModel) => {
      const featureMenuIds = _.chain(claims)
        .filter({ type: FEATURE_CLAIM_TYPE_ENUM.MENU, featureId: featureModel.id })
        .map((claim) => _.toNumber(claim.key))
        .value();
      const featurePermissionIds = _.chain(claims)
        .filter({ type: FEATURE_CLAIM_TYPE_ENUM.PERMISSION, featureId: featureModel.id })
        .map((claim) => _.toNumber(claim.key))
        .value();
      const featureActionIds = _.chain(claims)
        .filter({ type: FEATURE_CLAIM_TYPE_ENUM.ACTION, featureId: featureModel.id })
        .map((claim) => _.toNumber(claim.key))
        .value();
      const featureMenus = _.chain(menuModels)
        .filter((menuModel) => _.includes(featureMenuIds, menuModel.id))
        .value();
      const featurePermission = _.chain(permissionModels)
        .filter((permissionModel) => _.includes(featurePermissionIds, permissionModel.id))
        .value();
      const featureActions = _.chain(actionModels)
        .filter((actionModel) => _.includes(featureActionIds, actionModel.id))
        .value();
      featureModel.menus = featureMenus;
      featureModel.permissions = featurePermission;
      featureModel.actions = featureActions;
    });
    return featureModels;
  }

  public async getFeatureByIdOrFail(id: number): Promise<FeatureEntity> {
    const feature = await this.featureRepositoryService.findOne({ id });
    if (!feature) {
      throw new NotFoundException(`Not found system feature by id "${id}"!`);
    }
    return feature;
  }

  public async getFeatureByCodeOrFail(code: string): Promise<FeatureEntity> {
    const feature = await this.featureRepositoryService.findOne({ code });
    if (!feature) {
      throw new NotFoundException(`Not found system feature by code "${code}"!`);
    }
    return feature;
  }
}
