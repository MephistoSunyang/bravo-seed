import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CryptoModule } from '../crypto';
import { PassportController } from './controllers';
import { IJwtStrategyOptions } from './interfaces';
import { PassportSerializerService, PassportService } from './services';

@Global()
@Module({})
export class PassportModule {
  public static forRoot(options: IJwtStrategyOptions): DynamicModule {
    const modules = [JwtModule.register(options), CryptoModule];
    const controllers = [PassportController];
    const services = [PassportSerializerService, PassportService];
    const providers = [...services];
    return {
      module: PassportModule,
      imports: [...modules],
      controllers,
      providers,
      exports: [...modules, ...providers],
    };
  }
}
