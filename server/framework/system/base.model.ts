import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export abstract class BaseModel {
  @ApiProperty()
  @Expose()
  public id: number;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  public createdUserId: string | null;

  @ApiProperty()
  @Expose()
  public createdDate: Date;

  @ApiProperty({ type: 'string | null', example: null })
  @Expose()
  public modifiedUserId: string | null;

  @ApiProperty()
  @Expose()
  public modifiedDate: Date;

  @ApiProperty({ default: false, example: false })
  @Expose()
  public isDeleted: boolean;

  @ApiProperty({ default: 1, example: 1 })
  @Expose()
  public version: number;
}
