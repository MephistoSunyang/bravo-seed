import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CryptoModule } from '../crypto';
import { PassportLocalController } from './controllers';
import { IJwtStrategyOptions, ILocalStrategyOptions } from './interfaces';
import { SetJwtUserIdMiddleware } from './middlewares';
import { getPassportLocalStrategyOptionsToken } from './passport-local.utils';
import { LocalStrategy } from './strategies';

@Module({})
export class PassportLocalModule {
  public static forRoot(
    localStrategyOptions: ILocalStrategyOptions,
    jwtStrategyOptions: IJwtStrategyOptions,
  ): DynamicModule {
    const jwtModule = JwtModule.register(jwtStrategyOptions);
    const modules = [
      PassportModule.register({ defaultStrategy: 'local' }),
      jwtModule,
      CryptoModule,
    ];
    const controllers = [PassportLocalController];
    const middlewares = [SetJwtUserIdMiddleware];
    const strategies = [LocalStrategy];
    const valueProviders: ValueProvider[] = [
      { provide: getPassportLocalStrategyOptionsToken(), useValue: localStrategyOptions },
    ];
    const providers = [...middlewares, ...strategies, ...valueProviders];
    return {
      module: PassportLocalModule,
      controllers,
      imports: [...modules],
      providers,
      exports: [jwtModule, ...providers],
    };
  }
}
