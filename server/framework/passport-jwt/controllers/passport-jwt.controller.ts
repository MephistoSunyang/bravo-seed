import { HTTP_STATUS_CODE_ENUM } from '@bravo/core';
import { Body, Controller, Delete, Get, HttpCode, Put, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidatorPipe } from '../../validator';
import { IToken } from '../interfaces';
import { RefreshTokenModel } from '../models';
import { PassportJwtService } from '../services';

@ApiTags('auth')
@Controller('auth/v1')
@UsePipes(ValidatorPipe)
export class PassportJwtController {
  constructor(private readonly passportJwtService: PassportJwtService) {}

  @Get('token')
  public async getToken(@Query('ticket') ticket: string): Promise<IToken> {
    const token = this.passportJwtService.generateTokenByTicket(ticket);
    return token;
  }

  @Put('token')
  public async refreshToken(@Body() refreshTokenModel: RefreshTokenModel): Promise<IToken> {
    const token = this.passportJwtService.refreshToken(refreshTokenModel);
    return token;
  }

  @Delete('token')
  @HttpCode(HTTP_STATUS_CODE_ENUM.NO_CONTENT)
  public async logout(): Promise<boolean> {
    const result = await this.passportJwtService.deleteToken();
    return result;
  }
}
