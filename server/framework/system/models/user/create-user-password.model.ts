import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserPasswordModel {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public password: string;
}
