import { Module } from '@nestjs/common';
import { PassportModule } from './passport';
import { SystemModule } from './system';
import { TransformerModule } from './transformer';
import { ValidatorModule } from './validator';

const modules = [PassportModule, SystemModule, TransformerModule, ValidatorModule];

@Module({
  imports: [...modules],
})
export class FrameworkModule {}
