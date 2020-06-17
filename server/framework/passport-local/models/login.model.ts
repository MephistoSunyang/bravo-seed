import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginModel {
  @ApiProperty()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public username: string;

  @ApiProperty()
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  public password: string;
}
