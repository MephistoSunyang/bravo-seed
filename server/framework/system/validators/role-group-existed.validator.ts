import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';
import { RoleGroupEntity } from '../entities';
import { CreatedRoleGroupModel, UpdatedRoleGroupModel } from '../models';
import { BaseExistedValidator } from './base-existed.validator';

@ValidatorConstraint({ name: 'existed', async: true })
@Injectable()
export class RoleGroupExistedValidator extends BaseExistedValidator<RoleGroupEntity> {
  constructor(
    @InjectRepositoryService(RoleGroupEntity)
    protected readonly roleGroupRepositoryService: RepositoryService<RoleGroupEntity>,
  ) {
    super(roleGroupRepositoryService, [CreatedRoleGroupModel, UpdatedRoleGroupModel]);
  }
}
