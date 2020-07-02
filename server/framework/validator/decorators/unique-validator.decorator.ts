import { Validate, ValidationOptions } from 'class-validator';
import _ from 'lodash';
import { ObjectType } from 'typeorm';
import { UniqueValidatorService } from '../services';

export function UniqueValidator(
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
    Validate(UniqueValidatorService, [entityClass], validationOptions)(target, propertyKey);
  };
}
