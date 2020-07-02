import { OmitType } from '@nestjs/swagger';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { ConfigModel } from './config.model';

export class UpdatedConfigModel extends OmitType(ConfigModel, BASE_MODEL_FIELD_CONFIG.slice(1)) {}
