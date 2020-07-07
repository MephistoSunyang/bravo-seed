import { Transform, TransformOptions } from 'class-transformer';

export const NullTransformer = (options?: TransformOptions): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    Transform((value: string) => (value ? value : null), options)(target, propertyKey.toString());
  };
};
