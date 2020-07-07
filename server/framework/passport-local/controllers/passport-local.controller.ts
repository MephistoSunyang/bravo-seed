import { IRequest } from '@bravo/core';
import {
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ValidatorPipe } from '../../validator';
import { LoginModel } from '../models';

@ApiTags('auth')
@Controller('auth/v1')
@UsePipes(ValidatorPipe)
export class PassportLocalController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('current/token')
  public getToken(@Request() request: IRequest): string | null {
    return request.user ? this.jwtService.sign(request.user) : null;
  }

  @ApiBody({ type: LoginModel })
  @UseGuards(AuthGuard('local'))
  @Post('token')
  public async login(@Request() request: IRequest): Promise<string> {
    const { user } = request;
    if (!user) {
      throw new UnauthorizedException(`Not found user!`);
    }
    const token = this.jwtService.sign({ id: user['id'] });
    return token;
  }
}
