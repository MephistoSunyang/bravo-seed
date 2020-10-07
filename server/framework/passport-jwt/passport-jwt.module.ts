import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportJwtController } from './controllers';
import { IJwtStrategyOptions } from './interfaces';
import { SetJwtUserIdMiddleware } from './middlewares';
import { PassportJwtService } from './services';

@Global()
@Module({})
export class PassportJwtModule {
  public static forRoot(options: IJwtStrategyOptions): DynamicModule {
    const modules = [JwtModule.register(options)];
    const controllers = [PassportJwtController];
    const services = [PassportJwtService];
    const middlewares = [SetJwtUserIdMiddleware];
    const providers = [...services, ...middlewares];
    return {
      module: PassportJwtModule,
      imports: [...modules],
      controllers,
      providers,
      exports: [...providers],
    };
  }
}
