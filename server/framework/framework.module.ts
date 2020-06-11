import { Module } from '@nestjs/common';
import { SystemModule } from './system';

const modules = [SystemModule];

@Module({
  imports: [...modules],
})
export class FrameworkModule {}
