import { Controller, Get, Query } from '@nestjs/common';
import { PassportService } from '../services';

@Controller('auth/v1')
export class PassportController {
  constructor(private readonly passportService: PassportService) {}

  @Get('accessToken')
  public async getAccessToken(@Query('ticket') ticket: string): Promise<string> {
    const accessToken = this.passportService.getAccessTokenByTicket(ticket);
    return accessToken;
  }
}
