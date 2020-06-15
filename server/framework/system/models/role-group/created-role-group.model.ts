import { OmitType } from '@nestjs/swagger';
import { UniqueValidator } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleGroupEntity } from '../../entities';
import { RoleGroupModel } from './role-group.model';

export class CreatedRoleGroupModel extends OmitType(RoleGroupModel, BASE_MODEL_FIELD_CONFIG) {
  @UniqueValidator(RoleGroupEntity)
  public code: string;
}
