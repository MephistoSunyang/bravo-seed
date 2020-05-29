import { DynamicModule } from '@nestjs/common';
export declare class RepositoryModule {
    static forFeature(entities: Function[]): DynamicModule;
}
