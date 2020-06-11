import { OmitType, PartialType } from '@nestjs/swagger';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleGroupModel } from './role-group.model';

export class QueryRoleGroupModel extends PartialType(
  OmitType(RoleGroupModel, BASE_MODEL_FIELD_CONFIG),
) {}
