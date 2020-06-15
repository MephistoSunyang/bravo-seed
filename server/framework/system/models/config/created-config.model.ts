import { OmitType } from '@nestjs/swagger';
import { UniqueValidator } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { ConfigEntity } from '../../entities';
import { ConfigModel } from './config.model';

export class CreatedConfigModel extends OmitType(ConfigModel, BASE_MODEL_FIELD_CONFIG) {
  @UniqueValidator(ConfigEntity)
  public code: string;
}
