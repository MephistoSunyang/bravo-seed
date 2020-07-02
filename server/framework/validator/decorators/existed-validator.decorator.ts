import { Validate, ValidationOptions } from 'class-validator';
import _ from 'lodash';
import { ObjectType } from 'typeorm';
import { ExistedValidatorService } from '../services';

export function ExistedValidator(
  entityClass: ObjectType<any>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target, propertyKey) => {
    if (validationOptions && validationOptions.groups) {
      validationOptions.groups = _.map(
        validationOptions.groups,
        (group) => `${target.constructor.name}${group}`,
      );
    }
    Validate(ExistedValidatorService, [entityClass], validationOptions)(target, propertyKey);
  };
}
