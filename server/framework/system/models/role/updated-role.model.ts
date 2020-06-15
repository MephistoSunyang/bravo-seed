import { OmitType } from '@nestjs/swagger';
import { CreatedRoleModel } from './created-role.model';

export class UpdatedRoleModel extends OmitType(CreatedRoleModel, []) {}
