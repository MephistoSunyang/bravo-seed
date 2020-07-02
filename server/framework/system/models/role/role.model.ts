import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';
import { ExistedValidator, UniqueValidator, VALIDATOR_GROUP_ENUM } from '../../../validator';
import { BaseModel } from '../../base.model';
import { FeatureEntity, RoleEntity, RoleGroupEntity } from '../../entities';
import { FeatureModel } from '../feature';

export class RoleModel extends BaseModel {
  @ApiProperty({ default: 0, example: 0 })
  @Expose()
  @IsInt()
  @Min(0)
  @ExistedValidator(RoleGroupEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  public roleGroupId: number;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  @UniqueValidator(RoleEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  public code: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ type: () => [FeatureModel] })
  @Expose()
  @IsOptional()
  @ExistedValidator(FeatureEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  @Type(() => FeatureModel)
  public features?: FeatureModel[];

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  public comment: string | null;
}
