import { registerDecorator, ValidationOptions } from 'class-validator';
import { ObjectType } from 'typeorm';
import { ExistedValidatorService } from '../services';

export function ExistedValidator(
  entityClass: ObjectType<any>,
  validationOptions?: ValidationOptions,
) {
  return (model: object, propertyName: string) => {
    registerDecorator({
      target: model.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entityClass],
      validator: ExistedValidatorService,
    });
  };
}
