import { CoreModule, DataBaseModule } from '@bravo/core';
import { Module } from '@nestjs/common';
import { BusinessModule } from './business';
import { DATABASE_CONFIG } from './configs';
import { FrameworkModule } from './framework';
import { PluginModule } from './plugin';

const modules = [
  CoreModule,
  FrameworkModule,
  PluginModule,
  BusinessModule,
  DataBaseModule.forRoot(DATABASE_CONFIG),
];

@Module({
  imports: [...modules],
})
export class AppModule {}
