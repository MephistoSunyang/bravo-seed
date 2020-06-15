import { OmitType } from '@nestjs/swagger';
import { UniqueValidator } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { ActionEntity } from '../../entities';
import { ActionModel } from './action.model';

export class CreatedActionModel extends OmitType(ActionModel, BASE_MODEL_FIELD_CONFIG) {
  @UniqueValidator(ActionEntity)
  public code: string | null;
}
