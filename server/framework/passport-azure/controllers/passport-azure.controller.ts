import { DisableResult, IRedirect, IRequest, isLocal } from '@bravo/core';
import {
  Controller,
  Get,
  Post,
  Redirect,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import _ from 'lodash';
import { JWT_PAYLOAD_TYPE_ENUM, PassportJwtService } from '../../passport-jwt';

@ApiTags('auth.azure')
@Controller('auth/v1/azure')
export class PassportAzureController {
  constructor(private readonly passportJwtService: PassportJwtService) {}

  @Get('ticket')
  @UseGuards(AuthGuard('azuread-openidconnect'))
  // tslint:disable-next-line: no-empty
  public async login() {}

  @Get('callback')
  @UseGuards(AuthGuard('azuread-openidconnect'))
  @DisableResult()
  @Redirect()
  public async callback(@Request() request: IRequest): Promise<IRedirect> {
    const userId = request.user ? _.toNumber(request.user) : null;
    if (!userId) {
      throw new UnauthorizedException(`Not found userId!`);
    }
    const ticket = await this.passportJwtService.generateTicket(
      userId,
      JWT_PAYLOAD_TYPE_ENUM.AZURE,
      _.toString(userId),
    );
    const host = isLocal() ? 'http://localhost:3000' : process.env.HOST;
    return { url: `${host}/authentication?ticket=${ticket}` };
  }

  @Post('callback')
  @UseGuards(AuthGuard('azuread-openidconnect'))
  @DisableResult()
  @Redirect()
  public async postCallback(@Request() request: IRequest): Promise<IRedirect> {
    const userId = request.user ? _.toNumber(request.user) : null;
    if (!userId) {
      throw new UnauthorizedException(`Not found userId!`);
    }
    const ticket = await this.passportJwtService.generateTicket(
      userId,
      JWT_PAYLOAD_TYPE_ENUM.AZURE,
      _.toString(userId),
    );
    const host = isLocal() ? 'http://localhost:3000' : process.env.HOST;
    return { url: `${host}/authentication?ticket=${ticket}` };
  }
}
