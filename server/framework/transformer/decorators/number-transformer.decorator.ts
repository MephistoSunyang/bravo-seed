import { Transform, TransformOptions } from 'class-transformer';

export const NumberTransformer = (options?: TransformOptions): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    Transform((value) => Number(value), options)(target, propertyKey.toString());
  };
};
