import { OmitType } from '@nestjs/swagger';
import { CreatedMenuModel } from './created-menu.model';

export class UpdatedMenuModel extends OmitType(CreatedMenuModel, []) {}
