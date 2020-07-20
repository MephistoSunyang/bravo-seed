import { isLocal } from '@bravo/core';
import { Logger } from '@nestjs/common';
import _ from 'lodash';
import { IJwtStrategyOptions } from '../framework';

const { PASSPORT_JWT_SECRET: secret } = process.env;

const PASSPORT_JWT_STRATEGY_CONFIG: IJwtStrategyOptions = {
  secret: _.toString(secret),
  signOptions: {
    expiresIn: '1d',
  },
};

if (isLocal()) {
  Logger.debug(PASSPORT_JWT_STRATEGY_CONFIG, 'Passport JWT Strategy Config');
}

export { PASSPORT_JWT_STRATEGY_CONFIG };
