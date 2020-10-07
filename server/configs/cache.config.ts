import { isLocal, Logger } from '@bravo/core';
import _ from 'lodash';
import { RedisModuleOptions } from 'nestjs-redis';

const {
  REDIS_HOST: host,
  REDIS_PORT: port,
  REDIS_PASSWORD: password,
  REDIS_DATABASE: database,
} = process.env;

const CACHE_CONFIG: RedisModuleOptions = {
  host: _.toString(host),
  port: _.toNumber(port),
  password: _.toString(password),
  db: _.toNumber(database),
};

if (isLocal()) {
  Logger.debug(CACHE_CONFIG, 'Redis Config');
}

export { CACHE_CONFIG };
