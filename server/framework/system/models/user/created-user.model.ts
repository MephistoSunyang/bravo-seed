import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';
import { UniqueValidator } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { UserEntity } from '../../entities';
import { UserModel } from './user.model';

export class CreatedUserModel extends OmitType(UserModel, BASE_MODEL_FIELD_CONFIG) {
  @UniqueValidator(UserEntity)
  public username: string;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsOptional()
  public password: string | null;
}
