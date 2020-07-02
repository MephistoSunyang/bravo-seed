import { OmitType } from '@nestjs/swagger';
import { UpdatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { MenuModel } from './menu.model';

@UpdatedValidatorModel(MenuModel)
export class UpdatedMenuModel extends OmitType(MenuModel, BASE_MODEL_FIELD_CONFIG.slice(1)) {}
