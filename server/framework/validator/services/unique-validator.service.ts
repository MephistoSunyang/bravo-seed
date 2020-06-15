import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Connection } from 'typeorm';

@Injectable()
@ValidatorConstraint({ name: 'unique', async: true })
export class UniqueValidatorService implements ValidatorConstraintInterface {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  public async validate(value: any, validationArguments: ValidationArguments): Promise<boolean> {
    if (!value) {
      return true;
    }
    const entityClass = validationArguments.constraints[0];
    if (!entityClass) {
      throw new BadRequestException('Not found entityClass by UniqueValidatorService!');
    }
    const { property } = validationArguments;
    const entity = await this.connection.getRepository(entityClass).findOne({ [property]: value });
    return !entity;
  }

  public defaultMessage(validationArguments: ValidationArguments): string {
    const { value, property } = validationArguments;
    return `${property} ${value} must be a unique`;
  }
}
