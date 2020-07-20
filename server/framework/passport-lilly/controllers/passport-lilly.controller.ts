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
import { PassportService } from '../../passport';

@Controller('auth/v1/lilly')
export class PassportLillyController {
  constructor(private readonly passportService: PassportService) {}
  @Get('accessToken')
  @UseGuards(AuthGuard('azuread-openidconnect'))
  // tslint:disable-next-line: no-empty
  public async login() {}

  @Get('callback')
  @UseGuards(AuthGuard('azuread-openidconnect'))
  @DisableResult()
  @Redirect()
  public async callback(@Request() request: IRequest): Promise<IRedirect> {
    const { user: userId } = request;
    if (!userId) {
      throw new UnauthorizedException(`Not found userId!`);
    }
    const ticket = this.passportService.generateTicketByUserId(userId as number);
    const host = isLocal() ? 'http://localhost:3000' : process.env.HOST;
    return { url: `${host}/authentication?ticket=${ticket}` };
  }

  @Post('callback')
  @UseGuards(AuthGuard('azuread-openidconnect'))
  @DisableResult()
  @Redirect()
  public async postCallback(@Request() request: IRequest): Promise<IRedirect> {
    const { user: userId } = request;
    if (!userId) {
      throw new UnauthorizedException(`Not found userId!`);
    }
    const ticket = this.passportService.generateTicketByUserId(userId as number);
    const host = isLocal() ? 'http://localhost:3000' : process.env.HOST;
    return { url: `${host}/authentication?ticket=${ticket}` };
  }
}
