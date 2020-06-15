import { OmitType } from '@nestjs/swagger';
import { CreatedRoleGroupModel } from './created-role-group.model';

export class UpdatedRoleGroupModel extends OmitType(CreatedRoleGroupModel, []) {}
