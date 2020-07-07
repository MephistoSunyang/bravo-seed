import { OmitType } from '@nestjs/swagger';
import { UpdatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleGroupModel } from './role-group.model';

@UpdatedValidatorModel(RoleGroupModel)
export class UpdatedRoleGroupModel extends OmitType(
  RoleGroupModel,
  BASE_MODEL_FIELD_CONFIG.slice(1),
) {}
