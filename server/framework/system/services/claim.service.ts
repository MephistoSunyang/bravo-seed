import { RepositoryService } from '@bravo/core';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { In } from 'typeorm';
import { IClaimColumnOptions, IClaimOptions } from '../interfaces';

@Injectable()
export class ClaimService {
  private getClaimModels<IClaimEntity>(
    repositoryService: RepositoryService<IClaimEntity>,
    id: number,
    type: string,
    claims: any,
    columnOptions: IClaimColumnOptions,
  ): IClaimEntity[] {
    if (!_.isArray(claims)) {
      return [];
    }
    const { idField, typeField, keyField } = columnOptions;
    const claimModels = _.map(claims, (claim) => {
      const claimModel = {
        [idField]: id,
        [typeField]: type,
        [keyField]: _.toString(claim.id),
      };
      return repositoryService.create((claimModel as any) as IClaimEntity);
    });
    return claimModels;
  }

  public async createClaimsById<IClaimEntity>(
    repositoryService: RepositoryService<IClaimEntity>,
    id: number,
    options: IClaimOptions<IClaimEntity, string>,
    columnOptions: IClaimColumnOptions,
  ): Promise<IClaimEntity[]> {
    const claimModels = _.chain(options)
      .values()
      .compact()
      .map((option) =>
        this.getClaimModels(repositoryService, id, option.type, option.collections, columnOptions),
      )
      .flatMap()
      .value();
    return repositoryService.insertBulk(claimModels as IClaimEntity[]);
  }

  public async updateClaimById<IClaimEntity>(
    repositoryService: RepositoryService<IClaimEntity>,
    id: number,
    options: IClaimOptions<IClaimEntity, string>,
    columnOptions: IClaimColumnOptions,
  ): Promise<IClaimEntity[]> {
    const types = _.chain(options).values().compact().map('type').value();
    await this.deleteClaimsById(repositoryService, id, types, columnOptions);
    return this.createClaimsById(repositoryService, id, options, columnOptions);
  }

  public async deleteClaimsById<IClaimEntity>(
    repositoryService: RepositoryService<IClaimEntity>,
    id: number,
    types: string[],
    columnOptions: IClaimColumnOptions,
  ): Promise<IClaimEntity[]> {
    if (types.length === 0) {
      return Promise.resolve([]);
    }
    const { idField, typeField } = columnOptions;
    const conditions = {
      [idField]: id,
      [typeField]: In(types),
    };
    return repositoryService.deleteBulk(conditions as any);
  }
}
