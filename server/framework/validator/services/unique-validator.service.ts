import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Connection, Not } from 'typeorm';

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
    const { object: data, property } = validationArguments;
    const conditions = {
      [property]: value,
    };
    if (data['id']) {
      conditions.id = Not(data['id']);
    }
    const entity: any = await this.connection.getRepository(entityClass).findOne(conditions);
    const unique = entity ? false : true;
    return unique;
  }

  public defaultMessage(validationArguments: ValidationArguments): string {
    const { value, property } = validationArguments;
    return `${property} ${value} must be a unique`;
  }
}
