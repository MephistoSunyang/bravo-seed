import { RepositoryService } from '@bravo/core';
import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import _ from 'lodash';

export abstract class BaseExistedValidator<IEntity> implements ValidatorConstraintInterface {
  constructor(
    private readonly repositoryService: RepositoryService<IEntity>,
    private readonly validatorModels: Function[],
    private readonly idField: string = 'id',
  ) {}

  private getIds(value: number | number[] | any[]) {
    return _.isNumber(value) || (_.isArray(value) && _.isNumber(value[0]))
      ? _.castArray(value)
      : _.map(value, this.idField);
  }

  public async validate(value: number | number[] | any[], { targetName }: ValidationArguments) {
    if (!this.validatorModels.some((validatorModel) => validatorModel.name === targetName)) {
      return true;
    }
    if (!value || (_.isArray(value) && value.length === 0)) {
      return true;
    }
    const ids = this.getIds(value);
    const entities = await this.repositoryService.findByIds(ids);
    return entities.length === ids.length;
  }

  public defaultMessage(validationArguments: ValidationArguments) {
    const { value, property } = validationArguments;
    const ids = this.getIds(value).join(',');
    return `${property} ${ids} entities must be existed`;
  }
}
