import { Global, Module } from '@nestjs/common';
import { CryptoConfigService, CryptoPassportService, CryptoUserService } from './services';

const services = [CryptoConfigService, CryptoPassportService, CryptoUserService];
const providers = [...services];

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class CryptoModule {}
