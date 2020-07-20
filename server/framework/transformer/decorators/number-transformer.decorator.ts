import { Transform, TransformOptions } from 'class-transformer';
import _ from 'lodash';

export const NumberTransformer = (options?: TransformOptions): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    Transform((value) => _.toNumber(value), options)(target, propertyKey.toString());
  };
};
