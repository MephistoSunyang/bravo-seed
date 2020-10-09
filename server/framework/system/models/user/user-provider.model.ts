import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { USER_PROVIDER_TYPE_ENUM } from '../../enums';

export class UserProviderModel {
  @ApiProperty()
  @Expose()
  public id: number;

  @ApiProperty({ enum: USER_PROVIDER_TYPE_ENUM })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsEnum(USER_PROVIDER_TYPE_ENUM)
  @IsNotEmpty()
  public type: USER_PROVIDER_TYPE_ENUM;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public key: string;

  @ApiProperty()
  @Expose()
  @IsInt()
  @IsOptional()
  public userId: number;
}
