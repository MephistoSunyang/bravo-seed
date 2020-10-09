import { Module } from '@nestjs/common';
import { AttachmentModule } from './attachment';
import { CryptoModule } from './crypto';
import { InitializeDatabaseModule } from './initialize-database';
import { PassportModule } from './passport';
import { SystemModule } from './system';
import { TransformerModule } from './transformer';
import { ValidatorModule } from './validator';

const modules = [
  AttachmentModule,
  CryptoModule,
  InitializeDatabaseModule,
  PassportModule,
  SystemModule,
  TransformerModule,
  ValidatorModule,
];

@Module({
  imports: [...modules],
})
export class FrameworkModule {}
