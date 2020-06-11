import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';
import { ActionEntity } from '../entities';
import { CreatedActionModel, UpdatedActionModel } from '../models';
import { BaseCodeUniqueValidator } from './base-code-unique.validator';

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class ActionCodeUniqueValidator extends BaseCodeUniqueValidator<ActionEntity> {
  constructor(
    @InjectRepositoryService(ActionEntity)
    protected readonly actionRepositoryService: RepositoryService<ActionEntity>,
  ) {
    super(actionRepositoryService, [CreatedActionModel, UpdatedActionModel]);
  }
}
