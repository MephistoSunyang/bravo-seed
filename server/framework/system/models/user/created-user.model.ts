import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { UserModel } from './user.model';

export class CreatedUserModel extends OmitType(UserModel, BASE_MODEL_FIELD_CONFIG) {
  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsOptional()
  public password: string | null;
}
