import { OmitType } from '@nestjs/swagger';
import { CreatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { ActionModel } from './action.model';

@CreatedValidatorModel(ActionModel)
export class CreatedActionModel extends OmitType(ActionModel, BASE_MODEL_FIELD_CONFIG) {}
