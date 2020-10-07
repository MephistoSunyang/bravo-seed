import { RepositoryModule } from '@bravo/core';
import { Module, OnModuleInit } from '@nestjs/common';
import { SynchronizeDatabaseLogEntity } from './entities';
import { DatabaseService, SystemModuleService } from './services';

const entities = [SynchronizeDatabaseLogEntity];
const modules = [RepositoryModule.forFeature(entities)];
const services = [DatabaseService, SystemModuleService];
const providers = [...services];

@Module({
  imports: [...modules],
  providers,
})
export class SynchronizeDatabaseModule implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  public onModuleInit(): void {
    this.databaseService.synchronize();
  }
}