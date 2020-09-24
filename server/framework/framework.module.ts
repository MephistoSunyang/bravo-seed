import { Module } from '@nestjs/common';
import { AttachmentModule } from './attachment';
import { SynchronizeDatabaseModule } from './synchronize-database';
import { SystemModule } from './system';
import { TransformerModule } from './transformer';
import { ValidatorModule } from './validator';

const modules = [
  AttachmentModule,
  SynchronizeDatabaseModule,
  SystemModule,
  TransformerModule,
  ValidatorModule,
];

@Module({
  imports: [...modules],
})
export class FrameworkModule {}
