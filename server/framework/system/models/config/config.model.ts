import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length, Validate } from 'class-validator';
import { BaseModel } from '../../base.model';
import { ConfigCodeUniqueValidator } from '../../validators';

export class ConfigModel extends BaseModel {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  @Validate(ConfigCodeUniqueValidator)
  public code: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ example: false })
  @Expose()
  @IsBoolean()
  public contentEncrypted: boolean;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  public content: string;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  public comment: string | null;
}
