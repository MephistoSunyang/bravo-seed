import { Module, OnModuleInit } from '@nestjs/common';
import { CryptoModule } from '../crypto';
import { DatabaseService, SystemModuleService } from './services';

const modules = [CryptoModule];
const services = [DatabaseService, SystemModuleService];
const providers = [...services];

@Module({
  imports: [...modules],
  providers,
})
export class InitializeDatabaseModule implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  public onModuleInit(): void {
    this.databaseService.initialize();
  }
}
