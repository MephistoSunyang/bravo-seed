import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsPositive } from 'class-validator';
import { NumberTransformer } from '../transformer';

export class BaseQueryAndCountModel {
  @ApiProperty({ example: 1 })
  @Expose()
  @IsPositive()
  @NumberTransformer()
  public pageNumber: number;

  @ApiProperty({ example: 10 })
  @Expose()
  @IsPositive()
  @NumberTransformer()
  public pageSize: number;
}
