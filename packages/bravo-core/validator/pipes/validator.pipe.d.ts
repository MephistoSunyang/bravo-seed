import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class ValidatorPipe implements PipeTransform {
    private toValidate;
    transform(value: any, { metatype }: ArgumentMetadata): Promise<any>;
}
