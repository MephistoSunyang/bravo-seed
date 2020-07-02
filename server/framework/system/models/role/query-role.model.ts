import { OmitType, PartialType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleModel } from './role.model';

@QueryValidatorModel(RoleModel)
export class QueryRoleModel extends PartialType(OmitType(RoleModel, BASE_MODEL_FIELD_CONFIG)) {}
