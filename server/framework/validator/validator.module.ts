import { Global, Module } from '@nestjs/common';
import { ValidatorPipe } from './pipes';
import { ExistedValidatorService, UniqueValidatorService } from './services';

const pipes = [ValidatorPipe];
const services = [ExistedValidatorService, UniqueValidatorService];
const providers = [...pipes, ...services];

@Global()
@Module({
  providers,
})
export class ValidatorModule {}
