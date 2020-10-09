import {
  CoreModule,
  DataBaseModule,
  GetCurrentUserMiddleware,
  KeepHeaderMiddleware,
  SetHostMiddleware,
} from '@bravo/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BusinessModule } from './business';
import {
  CACHE_CONFIG,
  DATABASE_CONFIG,
  PASSPORT_AZURE_STRATEGY_CONFIG,
  PASSPORT_JWT_STRATEGY_CONFIG,
  PASSPORT_LOCAL_STRATEGY_CONFIG,
} from './configs';
import {
  CacheModule,
  FrameworkModule,
  PassportAzureModule,
  PassportJwtModule,
  PassportLocalModule,
  SetJwtUserIdMiddleware,
} from './framework';
import { PluginModule } from './plugin';

const modules = [
  CoreModule,
  FrameworkModule,
  PluginModule,
  BusinessModule,
  DataBaseModule.forRoot(DATABASE_CONFIG),
  CacheModule.forRoot(CACHE_CONFIG),
  PassportJwtModule.forRoot(PASSPORT_JWT_STRATEGY_CONFIG),
  PassportLocalModule.forRoot(PASSPORT_LOCAL_STRATEGY_CONFIG),
  PassportAzureModule.forRoot(PASSPORT_AZURE_STRATEGY_CONFIG),
];

@Module({
  imports: [...modules],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    const middlewares = [
      SetHostMiddleware,
      GetCurrentUserMiddleware,
      KeepHeaderMiddleware,
      SetJwtUserIdMiddleware,
    ];
    consumer.apply(...middlewares).forRoutes('*');
  }
}
