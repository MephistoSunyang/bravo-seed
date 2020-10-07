import { Module } from '@nestjs/common';
import { AttachmentModule } from './attachment';
import { CryptoModule } from './crypto';
import { PassportModule } from './passport';
import { SynchronizeDatabaseModule } from './synchronize-database';
import { SystemModule } from './system';
import { TransformerModule } from './transformer';
import { ValidatorModule } from './validator';

const modules = [
  AttachmentModule,
  CryptoModule,
  PassportModule,
  SynchronizeDatabaseModule,
  SystemModule,
  TransformerModule,
  ValidatorModule,
];

@Module({
  imports: [...modules],
})
export class FrameworkModule {}
