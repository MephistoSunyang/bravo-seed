import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';
import { RoleGroupEntity } from '../entities';
import { CreatedRoleGroupModel, UpdatedRoleGroupModel } from '../models';
import { BaseCodeUniqueValidator } from './base-code-unique.validator';

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class RoleGroupCodeUniqueValidator extends BaseCodeUniqueValidator<RoleGroupEntity> {
  constructor(
    @InjectRepositoryService(RoleGroupEntity)
    protected readonly roleGroupRepositoryService: RepositoryService<RoleGroupEntity>,
  ) {
    super(roleGroupRepositoryService, [CreatedRoleGroupModel, UpdatedRoleGroupModel]);
  }
}
