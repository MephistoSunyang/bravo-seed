import { isLocal } from '@bravo/core';
import { Logger } from '@nestjs/common';
import { IPassportLocalOptions } from '../framework';

const { USERNAME_FIELD: usernameField, PASSWORD_FIELD: passwordField } = process.env;

const PASSPORT_LOCAL_CONFIG: IPassportLocalOptions = {
  usernameField,
  passwordField,
  session: true,
  passReqToCallback: true,
};

if (isLocal()) {
  Logger.debug(PASSPORT_LOCAL_CONFIG, 'Passport Local Config');
}

export { PASSPORT_LOCAL_CONFIG };
