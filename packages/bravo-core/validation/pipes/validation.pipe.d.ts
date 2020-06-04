import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class ValidationPipe implements PipeTransform {
    private toValidate;
    transform(value: any, { metatype }: ArgumentMetadata): Promise<any>;
}
