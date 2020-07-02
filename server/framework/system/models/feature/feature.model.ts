import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { NullTransformer } from '../../../transformer';
import { ExistedValidator, UniqueValidator, VALIDATOR_GROUP_ENUM } from '../../../validator';
import { BaseModel } from '../../base.model';
import { ActionEntity, FeatureEntity, MenuEntity, PermissionEntity } from '../../entities';
import { ActionModel } from '../action';
import { MenuModel } from '../menu';
import { PermissionModel } from '../permission';

export class FeatureModel extends BaseModel {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  @UniqueValidator(FeatureEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  public code: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ type: () => [MenuModel] })
  @Expose()
  @IsOptional()
  @ExistedValidator(MenuEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  @Type(() => MenuModel)
  public menus?: MenuModel[];

  @ApiProperty({ type: () => [PermissionModel] })
  @Expose()
  @IsOptional()
  @ExistedValidator(PermissionEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  @Type(() => PermissionModel)
  public permissions?: PermissionModel[];

  @ApiProperty({ type: () => [ActionModel] })
  @Expose()
  @IsOptional()
  @ExistedValidator(ActionEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  @Type(() => ActionModel)
  public actions?: ActionModel[];

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  @NullTransformer()
  public comment: string | null;
}
