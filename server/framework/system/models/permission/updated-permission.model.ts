import { OmitType } from '@nestjs/swagger';
import { UpdatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { PermissionModel } from './permission.model';

@UpdatedValidatorModel(PermissionModel)
export class UpdatedPermissionModel extends OmitType(
  PermissionModel,
  BASE_MODEL_FIELD_CONFIG.slice(1),
) {}
