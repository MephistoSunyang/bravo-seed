import {
  CoreModule,
  DataBaseModule,
  GetCurrentUserMiddleware,
  KeepHeaderMiddleware,
  SetHostMiddleware,
} from '@bravo/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BusinessModule } from './business';
import { DATABASE_CONFIG } from './configs';
import { FrameworkModule } from './framework';
import { PluginModule } from './plugin';

const modules = [
  CoreModule,
  FrameworkModule,
  PluginModule,
  BusinessModule,
  DataBaseModule.forRoot(DATABASE_CONFIG),
];

@Module({
  imports: [...modules],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    const middlewares = [SetHostMiddleware, GetCurrentUserMiddleware, KeepHeaderMiddleware];
    consumer.apply(...middlewares).forRoutes('*');
  }
}
