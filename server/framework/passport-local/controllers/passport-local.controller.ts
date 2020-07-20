import { DisableExceptionLog, IRequest } from '@bravo/core';
import {
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PassportService } from '../../passport';
import { ValidatorPipe } from '../../validator';
import { LoginModel } from '../models';

@ApiTags('auth')
@Controller('auth/v1')
@UsePipes(ValidatorPipe)
export class PassportLocalController {
  constructor(private readonly passportService: PassportService) {}

  @ApiBody({ type: LoginModel })
  @Post('accessToken')
  @UseGuards(AuthGuard('local'))
  @DisableExceptionLog()
  public async login(@Request() request: IRequest): Promise<string> {
    const { user: userId } = request;
    if (!userId) {
      throw new UnauthorizedException(`Not found userId!`);
    }
    const accessToken = this.passportService.getAccessTokenByUserId(userId as number);
    return accessToken;
  }
}
