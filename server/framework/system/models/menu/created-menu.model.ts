import { OmitType } from '@nestjs/swagger';
import { CreatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { MenuModel } from './menu.model';

@CreatedValidatorModel(MenuModel)
export class CreatedMenuModel extends OmitType(MenuModel, BASE_MODEL_FIELD_CONFIG) {}
