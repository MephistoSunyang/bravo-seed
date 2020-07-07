import { OmitType } from '@nestjs/swagger';
import { UpdatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { FeatureModel } from './feature.model';

@UpdatedValidatorModel(FeatureModel)
export class UpdatedFeatureModel extends OmitType(FeatureModel, BASE_MODEL_FIELD_CONFIG.slice(1)) {}
