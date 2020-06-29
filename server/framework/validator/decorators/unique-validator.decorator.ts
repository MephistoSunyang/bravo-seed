import { Validate, ValidationOptions } from 'class-validator';
import { ObjectType } from 'typeorm';
import { UniqueValidatorService } from '../services';

export function UniqueValidator(
  entityClass: ObjectType<any>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return Validate(UniqueValidatorService, [entityClass], validationOptions);
}
