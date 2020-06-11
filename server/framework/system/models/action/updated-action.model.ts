import { OmitType } from '@nestjs/swagger';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { ActionModel } from './action.model';

export class UpdatedActionModel extends OmitType(ActionModel, BASE_MODEL_FIELD_CONFIG) {}
