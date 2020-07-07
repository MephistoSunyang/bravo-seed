import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';
import { NumberTransformer } from '../../../transformer';
import { ExistedValidator, QueryValidatorModel, VALIDATOR_GROUP_ENUM } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { RoleEntity } from '../../entities';
import { UserModel } from './user.model';

@QueryValidatorModel(UserModel)
export class QueryUserModel extends PartialType(OmitType(UserModel, BASE_MODEL_FIELD_CONFIG)) {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public type: string;

  @ApiProperty({ example: 1 })
  @Expose()
  @IsPositive()
  @NumberTransformer()
  @ExistedValidator(RoleEntity, {
    groups: [VALIDATOR_GROUP_ENUM.QUERY],
  })
  public roleId: number;
}
