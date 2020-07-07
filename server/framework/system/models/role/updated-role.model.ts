import { OmitType } from '@nestjs/swagger';
import { UpdatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleModel } from './role.model';

@UpdatedValidatorModel(RoleModel)
export class UpdatedRoleModel extends OmitType(RoleModel, BASE_MODEL_FIELD_CONFIG.slice(1)) {}
