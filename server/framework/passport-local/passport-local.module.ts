import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { PassportLocalController } from './controllers';
import { ILocalStrategyOptions } from './interfaces';
import { getPassportLocalStrategyOptionsToken } from './passport-local.utils';
import { LocalStrategy } from './strategies';

@Module({})
export class PassportLocalModule {
  public static forRoot(options: ILocalStrategyOptions): DynamicModule {
    const controllers = [PassportLocalController];
    const strategies = [LocalStrategy];
    const valueProviders: ValueProvider[] = [
      { provide: getPassportLocalStrategyOptionsToken(), useValue: options },
    ];
    const providers = [...strategies, ...valueProviders];
    return {
      module: PassportLocalModule,
      controllers,
      providers,
      exports: [...providers],
    };
  }
}
