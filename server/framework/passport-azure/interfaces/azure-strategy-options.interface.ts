import { IOIDCStrategyOptionWithRequest } from 'passport-azure-ad';

export interface IAzureStrategyOptions extends IOIDCStrategyOptionWithRequest {
  proxy: string | null;
}
