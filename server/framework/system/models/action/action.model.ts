import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { NullTransformer } from '../../../transformer';
import { UniqueValidator, VALIDATOR_GROUP_ENUM } from '../../../validator';
import { BaseModel } from '../../base.model';
import { ActionEntity } from '../../entities';
import { ACTION_METHOD_ENUM } from '../../enums';

export class ActionModel extends BaseModel {
  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsOptional()
  @UniqueValidator(ActionEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  @NullTransformer()
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
  @IsEnum(ACTION_METHOD_ENUM)
  @IsNotEmpty()
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
  @NullTransformer()
  public comment: string | null;
}
