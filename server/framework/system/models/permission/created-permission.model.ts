import { OmitType } from '@nestjs/swagger';
import { CreatedValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { PermissionModel } from './permission.model';

@CreatedValidatorModel(PermissionModel)
export class CreatedPermissionModel extends OmitType(PermissionModel, BASE_MODEL_FIELD_CONFIG) {}
