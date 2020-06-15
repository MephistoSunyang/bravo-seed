import { OmitType } from '@nestjs/swagger';
import { ExistedValidator } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { MenuEntity } from '../../entities';
import { MenuModel } from './menu.model';

export class CreatedMenuModel extends OmitType(MenuModel, BASE_MODEL_FIELD_CONFIG) {
  @ExistedValidator(MenuEntity)
  public parentId: number;
}
