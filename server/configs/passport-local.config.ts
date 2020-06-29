import { isLocal } from '@bravo/core';
import { Logger } from '@nestjs/common';
import { ILocalStrategyOptions } from '../framework';

const { USERNAME_FIELD: usernameField, PASSWORD_FIELD: passwordField } = process.env;

const PASSPORT_LOCAL_STRATEGY_CONFIG: ILocalStrategyOptions = {
  usernameField,
  passwordField,
};

if (isLocal()) {
  Logger.debug(PASSPORT_LOCAL_STRATEGY_CONFIG, 'Passport Local Strategy Config');
}

export { PASSPORT_LOCAL_STRATEGY_CONFIG };
