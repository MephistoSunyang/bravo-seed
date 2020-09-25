import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { PassportModule } from '../passport';
import { PassportAzureController } from './controllers';
import { IAzureStrategyOptions } from './interfaces';
import { getPassportAzureStrategyOptionsToken } from './passport-azure.utils';
import { AzureStrategy } from './strategies';

@Module({})
export class PassportAzureModule {
  public static forRoot(options: IAzureStrategyOptions): DynamicModule {
    const modules = [PassportModule];
    const controllers = [PassportAzureController];
    const strategies = [AzureStrategy];
    const valueProviders: ValueProvider[] = [
      { provide: getPassportAzureStrategyOptionsToken(), useValue: options },
    ];
    const providers = [...strategies, ...valueProviders];
    return {
      module: PassportAzureModule,
      controllers,
      imports: [...modules],
      providers,
      exports: [...providers],
    };
  }
}
