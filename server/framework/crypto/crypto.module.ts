import { Module } from '@nestjs/common';
import { CryptoConfigService, CryptoUserService } from './services';

const services = [CryptoConfigService, CryptoUserService];
const providers = [...services];

@Module({
  providers,
  exports: [...providers],
})
export class CryptoModule {}
