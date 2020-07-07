import { OmitType } from '@nestjs/swagger';
import { CreatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleGroupModel } from './role-group.model';

@CreatedValidatorModel(RoleGroupModel)
export class CreatedRoleGroupModel extends OmitType(RoleGroupModel, BASE_MODEL_FIELD_CONFIG) {}
