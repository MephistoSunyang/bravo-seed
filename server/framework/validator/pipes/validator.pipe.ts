import { Logger } from '@bravo/core';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import _ from 'lodash';
import { getBravoFrameworkMetadataArgsStorage } from '../../metadata-storage';

@Injectable()
export class ValidatorPipe implements PipeTransform {
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private getErrorMessage(errors: ValidationError[]): string {
    let message = errors.toString();
    const constraints = _.chain(errors)
      .flatMap('constraints')
      .map((constraint) => _.values(constraint))
      .flatMap()
      .value();
    if (constraints.length === 0) {
      return message;
    }
    message += 'The constraints messages:';
    message += constraints.map((constraint) => `\n - ${constraint}`);
    return message;
  }

  public async transform(value: any, { metatype, data: field }: ArgumentMetadata) {
    if (field || !metatype || !this.toValidate(metatype)) {
      return value;
    }
    const groups = getBravoFrameworkMetadataArgsStorage().validator.getValidatorGroupsByTarget(
      metatype,
    );
    const data = plainToClass(metatype, value, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
    const errors = await validate(data, {
      groups,
    });
    if (errors.length > 0) {
      Logger.error(this.getErrorMessage(errors), 'ValidatorModule ValidatorPipe Error');
      throw new BadRequestException('validation failed!');
    }
    return data;
  }
}
