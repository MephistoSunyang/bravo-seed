import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ExistedValidator, UniqueValidator, VALIDATOR_GROUP_ENUM } from '../../../validator';
import { BaseModel } from '../../base.model';
import { RoleEntity, UserEntity } from '../../entities';
import { RoleModel } from '../role';
import { UserProviderModel } from './user-provider.model';

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
  @IsOptional()
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
  @IsOptional()
  public emailConfirmed: boolean;

  @ApiProperty({ default: false, example: false })
  @Expose()
  @IsBoolean()
  @IsOptional()
  public hasPassword: boolean;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  public comment: string | null;

  @ApiProperty({ type: () => [UserProviderModel] })
  @Expose()
  @IsOptional()
  @Type(() => UserProviderModel)
  public providers?: UserProviderModel[];

  @ApiProperty({ type: () => [RoleModel] })
  @Expose()
  @IsOptional()
  @ExistedValidator(RoleEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  @Type(() => RoleModel)
  public roles?: RoleModel[];
}
