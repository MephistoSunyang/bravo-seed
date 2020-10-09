import { isLocal, Logger } from '@bravo/core';
import _ from 'lodash';
import { IAzureStrategyOptions } from '../framework';

const {
  PASSPORT_AZURE_IDENTITY_METADATA: identityMetadata,
  PASSPORT_AZURE_CLIENT_ID: clientId,
  PASSPORT_AZURE_CLIENT_SECRET: clientSecret,
  PASSPORT_AZURE_SCOPE: scope,
  PASSPORT_AZURE_RESPONSE_TYPE: responseType,
  PASSPORT_AZURE_RESPONSE_MODE: responseMode,
  PASSPORT_AZURE_REDIRECT_URL: redirectUrl,
} = process.env;

const PASSPORT_AZURE_STRATEGY_CONFIG: IAzureStrategyOptions = {
  identityMetadata: _.toString(identityMetadata),
  clientID: _.toString(clientId),
  clientSecret: _.toString(clientSecret),
  scope: _.toString(scope),
  responseType: _.toString(responseType) as any,
  responseMode: _.toString(responseMode) as any,
  redirectUrl: _.toString(redirectUrl),
  passReqToCallback: true,
  allowHttpForRedirectUrl: isLocal() ? true : false,
  loggingLevel: isLocal() ? 'info' : 'error',
  loggingNoPII: false,
  proxy: process.env.HTTPS_PROXY || process.env.HTTP_PROXY || null,
};

if (isLocal()) {
  Logger.debug(PASSPORT_AZURE_STRATEGY_CONFIG, 'Passport Azure Strategy Config');
}

export { PASSPORT_AZURE_STRATEGY_CONFIG };
