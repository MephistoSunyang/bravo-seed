import { RepositoryService } from '@bravo/core';
import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';

export abstract class BaseCodeUniqueValidator<IEntity> implements ValidatorConstraintInterface {
  constructor(
    private readonly repositoryService: RepositoryService<IEntity>,
    private readonly validatorModels: Function[],
    private readonly codeField = 'code',
  ) {}

  public async validate(code: string, { targetName }: ValidationArguments) {
    if (!this.validatorModels.some((validatorModel) => validatorModel.name === targetName)) {
      return true;
    }
    if (!code) {
      return true;
    }
    const entity = await this.repositoryService.findOne({ [this.codeField]: code });
    return !entity;
  }

  public defaultMessage(validationArguments: ValidationArguments) {
    const { value, property } = validationArguments;
    return `${property} ${value} must be unique`;
  }
}
