import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SystemModule } from '../system';
import { PassportLocalController } from './controllers';
import { IPassportLocalOptions } from './interfaces';
import { getPassportLocalStrategyServiceProvider } from './passport-local.utils';
import { PassportSerializerService } from './services';

@Module({})
export class PassportLocalModule {
  public static forRoot(options: IPassportLocalOptions): DynamicModule {
    const modules = [
      PassportModule.register({ defaultStrategy: 'local', session: options.session || true }),
      SystemModule,
    ];
    const controllers = [PassportLocalController];
    const services = [PassportSerializerService, getPassportLocalStrategyServiceProvider(options)];
    return {
      module: PassportLocalModule,
      controllers,
      imports: [...modules],
      providers: [...services],
      exports: [...services],
    };
  }
}
