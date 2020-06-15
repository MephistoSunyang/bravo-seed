import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';
import { BaseModel } from '../../base.model';

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
  public level: number;

  @ApiProperty({ default: 0, example: 0 })
  @Expose()
  @IsInt()
  @Min(0)
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
  public icon: string | null;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public path: string;

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
}
