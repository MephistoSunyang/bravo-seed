import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { BaseModel } from '../../system';
import { ATTACHMENT_STORAGE_TYPE_ENUM } from '../enums';

export class AttachmentModel extends BaseModel {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public encoding: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public originalName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsNotEmpty()
  public mimeType: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  public size: number;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public path: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public folderName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public fileName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public extName: string;

  @ApiProperty({ enum: ATTACHMENT_STORAGE_TYPE_ENUM })
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsEnum(ATTACHMENT_STORAGE_TYPE_ENUM)
  @IsNotEmpty()
  public storageType: ATTACHMENT_STORAGE_TYPE_ENUM;

  @ApiProperty()
  @Expose()
  public lastDownloadDate: Date;
}
