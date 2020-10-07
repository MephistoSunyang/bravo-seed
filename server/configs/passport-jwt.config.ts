import { isLocal, Logger } from '@bravo/core';
import _ from 'lodash';
import { IJwtStrategyOptions } from '../framework';

const { ACCESS_TOKEN_SECRET: secret, ACCESS_TOKEN_EXPIRES_IN: expiresIn } = process.env;

const PASSPORT_JWT_STRATEGY_CONFIG: IJwtStrategyOptions = {
  secret: _.toString(secret),
  signOptions: {
    expiresIn: `${expiresIn ? _.toNumber(expiresIn) : 1}d`,
  },
};

if (isLocal()) {
  Logger.debug(PASSPORT_JWT_STRATEGY_CONFIG, 'Passport JWT Strategy Config');
}

export { PASSPORT_JWT_STRATEGY_CONFIG };
