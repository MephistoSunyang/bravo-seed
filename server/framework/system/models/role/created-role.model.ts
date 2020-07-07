import { OmitType } from '@nestjs/swagger';
import { CreatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleModel } from './role.model';

@CreatedValidatorModel(RoleModel)
export class CreatedRoleModel extends OmitType(RoleModel, BASE_MODEL_FIELD_CONFIG) {}
