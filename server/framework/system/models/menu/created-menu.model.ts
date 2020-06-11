import { OmitType } from '@nestjs/swagger';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { MenuModel } from './menu.model';

export class CreatedMenuModel extends OmitType(MenuModel, BASE_MODEL_FIELD_CONFIG) {}
