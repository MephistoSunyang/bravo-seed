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
import _ from 'lodash';
import { IToken, JWT_PAYLOAD_TYPE_ENUM, PassportJwtService } from '../../passport-jwt';
import { ValidatorPipe } from '../../validator';
import { CreateTokenModel } from '../models';

@ApiTags('auth')
@Controller('auth/v1')
@UsePipes(ValidatorPipe)
export class PassportLocalController {
  constructor(private readonly passportJwtService: PassportJwtService) {}

  @ApiBody({ type: CreateTokenModel })
  @Post('token')
  @UseGuards(AuthGuard('local'))
  @DisableExceptionLog()
  public async login(@Request() request: IRequest): Promise<IToken> {
    const userId = request.user ? _.toNumber(request.user) : null;
    if (!userId) {
      throw new UnauthorizedException(`Not found userId!`);
    }
    const token = this.passportJwtService.generateTokenByUserId(
      userId,
      JWT_PAYLOAD_TYPE_ENUM.LOCAL,
      _.toString(userId),
    );
    return token;
  }
}
