import { ISynchronizeDatabaseConfig } from '../interfaces';

export const INITIALIZE_DATABASE_CONFIG: ISynchronizeDatabaseConfig[] = [
  { code: 'system', version: 1, action: 'synchronizeSystemModuleDatabase' },
];
