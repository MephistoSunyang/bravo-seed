import { OmitType } from '@nestjs/swagger';
import { CreatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { FeatureModel } from './feature.model';

@CreatedValidatorModel(FeatureModel)
export class CreatedFeatureModel extends OmitType(FeatureModel, BASE_MODEL_FIELD_CONFIG) {}
