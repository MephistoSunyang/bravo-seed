import { Module, OnModuleInit } from '@nestjs/common';
import { InitializeService, InitializeSystemModuleService } from './services';

const services = [InitializeService, InitializeSystemModuleService];
const providers = [...services];

@Module({
  providers,
})
export class InitializeDatabaseModule implements OnModuleInit {
  constructor(private readonly initializeService: InitializeService) {}

  public onModuleInit(): void {
    this.initializeService.database();
  }
}
