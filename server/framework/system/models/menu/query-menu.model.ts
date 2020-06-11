import { OmitType, PartialType } from '@nestjs/swagger';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { MenuModel } from './menu.model';

export class QueryMenuModel extends PartialType(
  OmitType(MenuModel, [...BASE_MODEL_FIELD_CONFIG, 'icon', 'path']),
) {}
