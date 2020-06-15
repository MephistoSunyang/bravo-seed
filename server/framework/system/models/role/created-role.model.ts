import { OmitType } from '@nestjs/swagger';
import { ExistedValidator, UniqueValidator } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleEntity, RoleGroupEntity } from '../../entities';
import { RoleModel } from './role.model';

export class CreatedRoleModel extends OmitType(RoleModel, BASE_MODEL_FIELD_CONFIG) {
  @ExistedValidator(RoleGroupEntity)
  public roleGroupId: number;

  @UniqueValidator(RoleEntity)
  public code: string;
}
