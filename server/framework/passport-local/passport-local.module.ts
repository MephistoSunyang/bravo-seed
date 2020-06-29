import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CryptoModule } from '../crypto';
import { PassportLocalController } from './controllers';
import { IJwtStrategyOptions, ILocalStrategyOptions } from './interfaces';
import { getPassportLocalStrategyOptionsToken } from './passport-local.utils';
import { LocalStrategy } from './strategies';

@Module({})
export class PassportLocalModule {
  public static forRoot(
    localStrategyOptions: ILocalStrategyOptions,
    jwtStrategyOptions: IJwtStrategyOptions,
  ): DynamicModule {
    const modules = [
      PassportModule.register({ defaultStrategy: 'local' }),
      JwtModule.register(jwtStrategyOptions),
      CryptoModule,
    ];
    const controllers = [PassportLocalController];
    const strategies = [LocalStrategy];
    const valueProviders: ValueProvider[] = [
      { provide: getPassportLocalStrategyOptionsToken(), useValue: localStrategyOptions },
    ];
    const providers = [...strategies, ...valueProviders];
    return {
      module: PassportLocalModule,
      controllers,
      imports: [...modules],
      providers,
      exports: [...providers],
    };
  }
}
