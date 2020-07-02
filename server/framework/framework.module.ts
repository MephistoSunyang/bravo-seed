import { Module } from '@nestjs/common';
import { InitializeDatabaseModule } from './initialize-database';
import { PassportModule } from './passport';
import { SystemModule } from './system';
import { TransformerModule } from './transformer';
import { ValidatorModule } from './validator';

const modules = [
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
