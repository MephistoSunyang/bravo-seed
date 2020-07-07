import { OmitType, PartialType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { FeatureModel } from './feature.model';

@QueryValidatorModel(FeatureModel)
export class QueryFeatureModel extends PartialType(
  OmitType(FeatureModel, BASE_MODEL_FIELD_CONFIG),
) {}
