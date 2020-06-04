import { AuditLogEntity, DatabaseLogger, getPath, isLocal, Logger } from '@bravo/core';
import { ConnectionOptions } from 'typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

const {
  DATABASE_HOST: host,
  DATABASE_INSTANCE: instanceName,
  DATABASE_PORT: port,
  DATABASE_NAME: database,
  DATABASE_USERNAME: username,
  DATABASE_PASSWORD: password,
  DATABASE_SYNCHRONIZE: synchronize,
} = process.env;
const logging: LoggerOptions = isLocal() ? true : ['warn', 'error', 'schema', 'migration'];

const DATABASE_CONFIG: ConnectionOptions = {
  type: 'mssql',
  host: String(host),
  port: Number(port),
  database: String(database),
  username: String(username),
  password: String(password),
  extra: {
    instanceName: instanceName ? instanceName : undefined,
  },
  entities: [
    AuditLogEntity,
    getPath('framework', '**/**.entity{.ts,.js}'),
    getPath('plugin', '**/**.entity{.ts,.js}'),
    getPath('business', '**/**.entity{.ts,.js}'),
  ],
  synchronize: synchronize === 'true',
  logger: new DatabaseLogger(logging),
  logging,
};

if (isLocal()) {
  Logger.debug(DATABASE_CONFIG, 'Database Config');
}

export { DATABASE_CONFIG };
