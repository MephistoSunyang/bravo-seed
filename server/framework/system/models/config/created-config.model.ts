import { OmitType } from '@nestjs/swagger';
import { CreatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { ConfigModel } from './config.model';

@CreatedValidatorModel(ConfigModel)
export class CreatedConfigModel extends OmitType(ConfigModel, BASE_MODEL_FIELD_CONFIG) {}
