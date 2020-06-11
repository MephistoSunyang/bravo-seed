import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseModel {
  @ApiProperty()
  public id: number;

  @ApiProperty({ type: 'string | null', example: null })
  public createdUserId: string | null;

  @ApiProperty()
  public createdDate: Date;

  @ApiProperty({ type: 'string | null', example: null })
  public modifiedUserId: string | null;

  @ApiProperty()
  public modifiedDate: Date;

  @ApiProperty({ default: false, example: false })
  public isDeleted: boolean;

  @ApiProperty({ default: 1, example: 1 })
  public version: number;
}
