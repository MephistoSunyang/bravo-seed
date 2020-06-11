import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';
import { ConfigEntity } from '../entities';
import { CreatedConfigModel, UpdatedConfigModel } from '../models';
import { BaseCodeUniqueValidator } from './base-code-unique.validator';

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class ConfigCodeUniqueValidator extends BaseCodeUniqueValidator<ConfigEntity> {
  constructor(
    @InjectRepositoryService(ConfigEntity)
    protected readonly configRepositoryService: RepositoryService<ConfigEntity>,
  ) {
    super(configRepositoryService, [CreatedConfigModel, UpdatedConfigModel]);
  }
}
