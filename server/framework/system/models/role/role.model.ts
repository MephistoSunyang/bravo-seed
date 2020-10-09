import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';
import { ExistedValidator, UniqueValidator, VALIDATOR_GROUP_ENUM } from '../../../validator';
import { BaseModel } from '../../base.model';
import { RoleEntity, RoleGroupEntity } from '../../entities';
import { ActionModel } from '../action';
import { MenuModel } from '../menu';
import { PermissionModel } from '../permission';

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

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  public comment: string | null;

  @ApiProperty({ type: () => [MenuModel] })
  @Expose()
  @IsOptional()
  @ExistedValidator(MenuModel, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  @Type(() => MenuModel)
  public menus?: MenuModel[];

  @ApiProperty({ type: () => [PermissionModel] })
  @Expose()
  @IsOptional()
  @ExistedValidator(PermissionModel, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  @Type(() => PermissionModel)
  public permissions?: PermissionModel[];

  @ApiProperty({ type: () => [ActionModel] })
  @Expose()
  @IsOptional()
  @ExistedValidator(ActionModel, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  @Type(() => ActionModel)
  public actions?: ActionModel[];
}
