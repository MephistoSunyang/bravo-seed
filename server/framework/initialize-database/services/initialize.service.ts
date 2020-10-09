import { Injectable } from '@nestjs/common';
import { InitializeSystemModuleService } from './initialize-system-module.service';

@Injectable()
export class InitializeService {
  constructor(private readonly initializeSystemModuleService: InitializeSystemModuleService) {}

  public async database(): Promise<void> {
    this.initializeSystemModuleService.database();
  }
}
