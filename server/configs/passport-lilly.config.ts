import { isLocal } from '@bravo/core';
import { Logger } from '@nestjs/common';
import _ from 'lodash';
import { ILillyStrategyOptions } from '../framework';

const {
  PASSPORT_LILLY_IDENTITY_METADATA: identityMetadata,
  PASSPORT_LILLY_CLIENT_ID: clientId,
  PASSPORT_LILLY_CLIENT_SECRET: clientSecret,
  PASSPORT_LILLY_SCOPE: scope,
  PASSPORT_LILLY_RESPONSE_TYPE: responseType,
  PASSPORT_LILLY_RESPONSE_MODE: responseMode,
  PASSPORT_LILLY_REDIRECT_URL: redirectUrl,
} = process.env;

const PASSPORT_LILLY_STRATEGY_CONFIG: ILillyStrategyOptions = {
  identityMetadata: _.toString(identityMetadata),
  clientID: _.toString(clientId),
  clientSecret: _.toString(clientSecret),
  scope: _.toString(scope),
  responseType: _.toString(responseType) as any,
  responseMode: _.toString(responseMode) as any,
  redirectUrl: _.toString(redirectUrl),
  passReqToCallback: true,
  allowHttpForRedirectUrl: isLocal() ? true : false,
};

if (isLocal()) {
  Logger.debug(PASSPORT_LILLY_STRATEGY_CONFIG, 'Passport Lilly Strategy Config');
}

export { PASSPORT_LILLY_STRATEGY_CONFIG };
