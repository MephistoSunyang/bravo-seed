import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { BaseModel } from '../../base.model';
import { ACTION_METHOD_ENUM } from '../../enums';

export class ActionModel extends BaseModel {
  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsOptional()
  public code: string | null;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ enum: ACTION_METHOD_ENUM })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  @IsEnum(ACTION_METHOD_ENUM)
  public method: ACTION_METHOD_ENUM;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public path: string;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  public comment: string | null;
}
