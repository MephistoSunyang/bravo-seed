import { OmitType } from '@nestjs/swagger';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleModel } from './role.model';

export class UpdatedRoleModel extends OmitType(RoleModel, BASE_MODEL_FIELD_CONFIG) {}
