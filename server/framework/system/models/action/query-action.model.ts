import { OmitType, PartialType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { ActionModel } from './action.model';

@QueryValidatorModel(ActionModel)
export class QueryActionModel extends PartialType(OmitType(ActionModel, BASE_MODEL_FIELD_CONFIG)) {}
