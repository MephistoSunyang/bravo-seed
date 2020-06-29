import { Validate, ValidationOptions } from 'class-validator';
import { ObjectType } from 'typeorm';
import { ExistedValidatorService } from '../services';

export function ExistedValidator(
  entityClass: ObjectType<any>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return Validate(ExistedValidatorService, [entityClass], validationOptions);
}
