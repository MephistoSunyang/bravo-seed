import { FEATURE_CLAIM_TYPE_ENUM } from '../enums';
import { FeatureModel } from '../models';
import { IClaimOptions } from './claim-options.interface';

export type IFeatureClaimOptions = IClaimOptions<FeatureModel, FEATURE_CLAIM_TYPE_ENUM>;
