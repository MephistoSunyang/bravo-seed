import { AuditLogEntity, DatabaseLogger, getPath, isLocal, Logger } from '@bravo/core';
import _ from 'lodash';
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
  host: _.toString(host),
  port: _.toNumber(port),
  database: _.toString(database),
  username: _.toString(username),
  password: _.toString(password),
  extra: {
    instanceName: instanceName ? instanceName : undefined,
  },
  entities: [
    AuditLogEntity,
    getPath(__dirname, '../framework', '**/**.entity{.ts,.js}'),
    getPath(__dirname, '../plugin', '**/**.entity{.ts,.js}'),
    getPath(__dirname, '../business', '**/**.entity{.ts,.js}'),
  ],
  synchronize: synchronize === 'true',
  logger: new DatabaseLogger(logging),
  logging,
};

if (isLocal()) {
  Logger.debug(DATABASE_CONFIG, 'Database Config');
}

export { DATABASE_CONFIG };
