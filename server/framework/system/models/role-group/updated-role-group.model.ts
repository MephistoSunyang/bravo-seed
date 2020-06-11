import { OmitType } from '@nestjs/swagger';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleGroupModel } from './role-group.model';

export class UpdatedRoleGroupModel extends OmitType(RoleGroupModel, BASE_MODEL_FIELD_CONFIG) {}
