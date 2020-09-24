import { SYNCHRONIZE_DATABASE_LOG_STATUS_ENUMS } from '../enums';

export interface ISynchronizeDatabaseTaskResult {
  status: SYNCHRONIZE_DATABASE_LOG_STATUS_ENUMS;
  exception?: string;
}
