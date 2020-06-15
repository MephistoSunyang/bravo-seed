import { Module } from '@nestjs/common';
import { SystemModule } from './system';
import { ValidatorModule } from './validator';

const modules = [SystemModule, ValidatorModule];

@Module({
  imports: [...modules],
})
export class FrameworkModule {}
