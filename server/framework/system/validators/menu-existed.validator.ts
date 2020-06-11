import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';
import { MenuEntity } from '../entities';
import { CreatedMenuModel, UpdatedMenuModel } from '../models';
import { BaseExistedValidator } from './base-existed.validator';

@ValidatorConstraint({ name: 'existed', async: true })
@Injectable()
export class MenuExistedValidator extends BaseExistedValidator<MenuEntity> {
  constructor(
    @InjectRepositoryService(MenuEntity)
    protected readonly menuRepositoryService: RepositoryService<MenuEntity>,
  ) {
    super(menuRepositoryService, [CreatedMenuModel, UpdatedMenuModel]);
  }
}
