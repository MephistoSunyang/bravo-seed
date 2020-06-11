import { OmitType, PartialType } from '@nestjs/swagger';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { ConfigModel } from './config.model';

export class QueryConfigModel extends PartialType(OmitType(ConfigModel, BASE_MODEL_FIELD_CONFIG)) {}
