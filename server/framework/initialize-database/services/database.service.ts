import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { INITIALIZE_DATABASE_CONFIG } from '../configs';
import { SystemModuleService } from './system-module.service';

@Injectable()
export class DatabaseService {
  constructor(private readonly systemModuleService: SystemModuleService) {}

  protected initializeSystemModuleDatabase(): void {
    this.systemModuleService.initializeDatabase();
  }

  public async initialize(): Promise<void> {
    const enable = process.env.INITIALIZE_DATABASE_ENABLE === 'true';
    const code = process.env.INITIALIZE_DATABASE_CODE;
    if (!enable) {
      return;
    }
    const initializeTasks = _.chain(INITIALIZE_DATABASE_CONFIG)
      .filter((config) => {
        return code ? config.code === code : true;
      })
      .map((config) => this[config.action].bind(this))
      .compact()
      .value();
    if (initializeTasks.length === 0) {
      return;
    }
    await Promise.all(_.map(initializeTasks, (task) => task()));
  }
}
