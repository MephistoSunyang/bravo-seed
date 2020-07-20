import { Logger } from '@bravo/core';
import { BadRequestException } from '@nestjs/common';
import { Transform, TransformOptions } from 'class-transformer';

export const JsonTransformer = (options?: TransformOptions): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    Transform((value: string) => {
      if (!value) {
        return undefined;
      }
      try {
        return JSON.parse(value);
      } catch (error) {
        Logger.error(error, 'TransformerModule JsonTransformer');
        throw new BadRequestException(`invalid json format "${value}"!`);
      }
    }, options)(target, propertyKey.toString());
  };
};
