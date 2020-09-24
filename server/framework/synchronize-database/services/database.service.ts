import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { SYNCHRONIZE_DATABASE_CONFIG } from '../configs';
import { SynchronizeDatabaseLogEntity } from '../entities';
import { SYNCHRONIZE_DATABASE_LOG_STATUS_ENUMS } from '../enums';
import { ISynchronizeDatabaseTaskResult } from '../interfaces';
import { SystemModuleService } from './system-module.service';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepositoryService(SynchronizeDatabaseLogEntity)
    private readonly synchronizeDatabaseLogRepositoryService: RepositoryService<
      SynchronizeDatabaseLogEntity
    >,
    private readonly systemModuleService: SystemModuleService,
  ) {}

  protected synchronizeSystemModuleDatabase(): Promise<ISynchronizeDatabaseTaskResult> {
    return this.systemModuleService.synchronizeDatabase();
  }

  public async synchronize(): Promise<void> {
    const enable = process.env.INITIALIZE_DATABASE_ENABLE === 'true';
    if (!enable) {
      return;
    }
    const logs = await this.synchronizeDatabaseLogRepositoryService.find({
      status: SYNCHRONIZE_DATABASE_LOG_STATUS_ENUMS.SUCCEED,
    });
    const configs = _.chain(SYNCHRONIZE_DATABASE_CONFIG)
      .filter(({ code, version }) => (_.find(logs, { code, version }) ? false : true))
      .filter((config) => (this[config.action] ? true : false))
      .value();
    const tasks = _.map(configs, (config) => this[config.action].bind(this));
    if (tasks.length === 0) {
      return;
    }
    const results: ISynchronizeDatabaseTaskResult[] = await Promise.all(
      _.map(tasks, (task) => task()),
    );
    const logModels = _.map(results, (result, index) =>
      this.synchronizeDatabaseLogRepositoryService.create({
        code: configs[index].code,
        version: configs[index].version,
        status: result.status,
        exception: result.exception ? result.exception : '',
      }),
    );
    await this.synchronizeDatabaseLogRepositoryService.insertBulk(logModels);
  }
}
