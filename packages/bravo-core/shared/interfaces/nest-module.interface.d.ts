import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
export declare type INestModule = Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;
