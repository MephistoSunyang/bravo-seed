import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { JsonTransformer } from '../../../transformer';

export class QueryCurrentUserMenuModel {
  @ApiProperty()
  @Expose()
  @IsArray()
  @IsOptional()
  @JsonTransformer()
  public groups?: string[];
}
