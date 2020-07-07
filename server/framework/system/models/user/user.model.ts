import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ExistedValidator, UniqueValidator, VALIDATOR_GROUP_ENUM } from '../../../validator';
import { BaseModel } from '../../base.model';
import { RoleEntity, UserEntity } from '../../entities';
import { USER_PROVIDER_TYPE_ENUM } from '../../enums';
import { RoleModel } from '../role';

export class UserModel extends BaseModel {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  @UniqueValidator(UserEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  public username: string;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsOptional()
  public nickname: string | null;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsOptional()
  public realname: string | null;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsOptional()
  public phone: string | null;

  @ApiProperty({ default: false, example: false })
  @Expose()
  @IsBoolean()
  public phoneConfirmed: boolean;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsOptional()
  public email: string | null;

  @ApiProperty({ default: false, example: false })
  @Expose()
  @IsBoolean()
  public emailConfirmed: boolean;

  @ApiProperty({ type: () => [RoleModel] })
  @Expose()
  @IsOptional()
  @ExistedValidator(RoleEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  @Type(() => RoleModel)
  public roles?: RoleModel[];

  @ApiProperty()
  @Expose()
  @IsArray()
  @IsOptional()
  @IsEnum(USER_PROVIDER_TYPE_ENUM)
  public types?: USER_PROVIDER_TYPE_ENUM[];

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  public comment: string | null;
}
