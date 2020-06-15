import { OmitType } from '@nestjs/swagger';
import { CreatedActionModel } from './created-action.model';

export class UpdatedActionModel extends OmitType(CreatedActionModel, []) {}
