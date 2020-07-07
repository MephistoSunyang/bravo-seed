import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';
import { NullTransformer } from '../../../transformer';
import { ExistedValidator, VALIDATOR_GROUP_ENUM } from '../../../validator';
import { BaseModel } from '../../base.model';
import { MenuEntity } from '../../entities';

export class MenuModel extends BaseModel {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public group: string;

  @ApiProperty({ default: 0, example: 0 })
  @Expose()
  @IsInt()
  @Min(0)
  @ExistedValidator(MenuEntity, {
    groups: [VALIDATOR_GROUP_ENUM.CREATED, VALIDATOR_GROUP_ENUM.UPDATED],
  })
  public parentId: number;

  @ApiProperty({ default: 0, example: 0 })
  @Expose()
  @IsInt()
  @Min(0)
  public sort: number;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsOptional()
  @NullTransformer()
  public icon: string | null;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsOptional()
  @NullTransformer()
  public path: string | null;

  @ApiProperty({ default: false, example: false })
  @Expose()
  @IsBoolean()
  public visible: boolean;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  public comment: string | null;

  @ApiProperty({ type: () => [MenuModel], example: [] })
  public subMenus: MenuModel[];
}
