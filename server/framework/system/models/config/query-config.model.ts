import { OmitType, PartialType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { ConfigModel } from './config.model';

@QueryValidatorModel(ConfigModel)
export class QueryConfigModel extends PartialType(OmitType(ConfigModel, BASE_MODEL_FIELD_CONFIG)) {}
