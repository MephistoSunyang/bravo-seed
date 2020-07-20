import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { PassportModule } from '../passport';
import { PassportLillyController } from './controllers';
import { ILillyStrategyOptions } from './interfaces';
import { getPassportLillyStrategyOptionsToken } from './passport-lilly.utils';
import { LillyStrategy } from './strategies';

@Module({})
export class PassportLillyModule {
  public static forRoot(options: ILillyStrategyOptions): DynamicModule {
    const modules = [PassportModule];
    const controllers = [PassportLillyController];
    const strategies = [LillyStrategy];
    const valueProviders: ValueProvider[] = [
      { provide: getPassportLillyStrategyOptionsToken(), useValue: options },
    ];
    const providers = [...strategies, ...valueProviders];
    return {
      module: PassportLillyModule,
      controllers,
      imports: [...modules],
      providers,
      exports: [...providers],
    };
  }
}
