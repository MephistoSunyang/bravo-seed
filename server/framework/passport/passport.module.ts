import { Module } from '@nestjs/common';
import { PassportSerializerService } from './services';

const services = [PassportSerializerService];
const providers = [...services];

@Module({
  providers,
})
export class PassportModule {}
