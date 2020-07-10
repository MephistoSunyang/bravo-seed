import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../system';
import { QueryValidatorModel } from '../../validator';
import { AttachmentModel } from './attachment.model';

@QueryValidatorModel(AttachmentModel)
export class QueryAttachmentModel extends PartialType(
  OmitType(AttachmentModel, [...BASE_MODEL_FIELD_CONFIG, 'lastDownloadDate']),
) {
  @ApiProperty()
  @Expose()
  @IsDateString()
  @IsOptional()
  public beginLastDownloadDate: string;

  @ApiProperty()
  @Expose()
  @IsDateString()
  @IsOptional()
  public endLastDownloadDate: string;
}
