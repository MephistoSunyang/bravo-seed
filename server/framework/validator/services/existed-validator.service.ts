import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import _ from 'lodash';
import { Connection } from 'typeorm';

@Injectable()
@ValidatorConstraint({ name: 'existed', async: true })
export class ExistedValidatorService implements ValidatorConstraintInterface {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  private getIds(value: any): number[] {
    const ids = _.isArray(value)
      ? _.isNumber(value[0])
        ? value
        : _.map(value, 'id')
      : _.castArray(value);
    return ids;
  }

  public async validate(value: any, validationArguments: ValidationArguments): Promise<boolean> {
    if (!value) {
      return true;
    }
    if (_.isArray(value) && value.length === 0) {
      return true;
    }
    const entityClass = validationArguments.constraints[0];
    if (!entityClass) {
      throw new BadRequestException('Not found entityClass by ExistedValidatorService!');
    }
    const ids = this.getIds(value);
    const entity = await this.connection.getRepository(entityClass).findByIds(ids);
    return !entity;
  }

  public defaultMessage(validationArguments: ValidationArguments): string {
    const { value, property } = validationArguments;
    return `${property} ${this.getIds(value).join(',')} must be a unique`;
  }
}
