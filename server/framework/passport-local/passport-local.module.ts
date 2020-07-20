import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { CryptoModule } from '../crypto';
import { PassportLocalController } from './controllers';
import { ILocalStrategyOptions } from './interfaces';
import { SetJwtUserIdMiddleware } from './middlewares';
import { getPassportLocalStrategyOptionsToken } from './passport-local.utils';
import { LocalStrategy } from './strategies';
import { PassportModule } from '../passport';

@Module({})
export class PassportLocalModule {
  public static forRoot(options: ILocalStrategyOptions): DynamicModule {
    const modules = [CryptoModule, PassportModule];
    const controllers = [PassportLocalController];
    const middlewares = [SetJwtUserIdMiddleware];
    const strategies = [LocalStrategy];
    const valueProviders: ValueProvider[] = [
      { provide: getPassportLocalStrategyOptionsToken(), useValue: options },
    ];
    const providers = [...middlewares, ...strategies, ...valueProviders];
    return {
      module: PassportLocalModule,
      controllers,
      imports: [...modules],
      providers,
      exports: [...providers],
    };
  }
}
