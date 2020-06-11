import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';
import { RoleEntity } from '../entities';
import { CreatedRoleModel, UpdatedRoleModel } from '../models';
import { BaseCodeUniqueValidator } from './base-code-unique.validator';

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class RoleCodeUniqueValidator extends BaseCodeUniqueValidator<RoleEntity> {
  constructor(
    @InjectRepositoryService(RoleEntity)
    protected readonly roleRepositoryService: RepositoryService<RoleEntity>,
  ) {
    super(roleRepositoryService, [CreatedRoleModel, UpdatedRoleModel]);
  }
}
