import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class BaseQueryAndCountModel {
  @ApiProperty()
  @Expose()
  @IsPositive()
  public pageNumber: number;

  @ApiProperty()
  @Expose()
  @IsPositive()
  public pageSize: number;
}
