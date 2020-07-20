import { isLocal } from '@bravo/core';
import { Logger } from '@nestjs/common';
import { ILocalStrategyOptions } from '../framework';

const {
  PASSPORT_LOCAL_USERNAME_FIELD: usernameField,
  PASSPORT_LOCAL_PASSWORD_FIELD: passwordField,
} = process.env;

const PASSPORT_LOCAL_STRATEGY_CONFIG: ILocalStrategyOptions = {
  usernameField,
  passwordField,
  passReqToCallback: true,
};

if (isLocal()) {
  Logger.debug(PASSPORT_LOCAL_STRATEGY_CONFIG, 'Passport Local Strategy Config');
}

export { PASSPORT_LOCAL_STRATEGY_CONFIG };
