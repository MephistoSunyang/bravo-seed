import { OmitType, PartialType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { MenuModel } from './menu.model';

@QueryValidatorModel(MenuModel)
export class QueryMenuModel extends PartialType(OmitType(MenuModel, BASE_MODEL_FIELD_CONFIG)) {}
