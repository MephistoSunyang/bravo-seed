import { OmitType } from '@nestjs/swagger';
import { UpdatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { ActionModel } from './action.model';

@UpdatedValidatorModel(ActionModel)
export class UpdatedActionModel extends OmitType(ActionModel, BASE_MODEL_FIELD_CONFIG.slice(1)) {}
