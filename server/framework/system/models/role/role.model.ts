import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Min, Validate } from 'class-validator';
import { BaseModel } from '../../base.model';
import { RoleCodeUniqueValidator, RoleGroupExistedValidator } from '../../validators';

export class RoleModel extends BaseModel {
  @ApiProperty({ default: 0, example: 0 })
  @Expose()
  @IsInt()
  @Min(0)
  @Validate(RoleGroupExistedValidator)
  public roleGroupId: number;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  @Validate(RoleCodeUniqueValidator)
  public code: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  public comment: string | null;
}