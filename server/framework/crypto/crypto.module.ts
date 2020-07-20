import { Module } from '@nestjs/common';
import { CryptoConfigService, CryptoPassportService, CryptoUserService } from './services';

const services = [CryptoConfigService, CryptoPassportService, CryptoUserService];
const providers = [...services];

@Module({
  providers,
  exports: [...providers],
})
export class CryptoModule {}
