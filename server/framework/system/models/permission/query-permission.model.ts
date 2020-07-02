import { OmitType, PartialType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { PermissionModel } from './permission.model';

@QueryValidatorModel(PermissionModel)
export class QueryPermissionModel extends PartialType(
  OmitType(PermissionModel, BASE_MODEL_FIELD_CONFIG),
) {}
