import { DynamicModule, OnModuleInit } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
export declare class DataBaseModule implements OnModuleInit {
    private readonly connection;
    static synchronize: boolean;
    constructor(connection: Connection);
    static forRoot(options: TypeOrmModuleOptions): DynamicModule;
    onModuleInit(): Promise<void>;
}
