import { HTTP_STATUS_CODE_ENUM, IRequest } from '@bravo/core';
import {
  Controller,
  HttpCode,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import util from 'util';
import { UserModel } from '../../system';
import { ValidatorPipe } from '../../validator';
import { LoginModel } from '../models';

@ApiTags('auth')
@Controller('auth/v1')
@UsePipes(ValidatorPipe)
export class PassportLocalController {
  @ApiBody({
    type: LoginModel,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: UserModel,
  })
  @UseGuards(AuthGuard('local'))
  @HttpCode(HTTP_STATUS_CODE_ENUM.OK)
  @Post('login')
  public async login(@Request() request: IRequest): Promise<UserModel> {
    const { user } = request;
    if (!user) {
      throw new UnauthorizedException(`Not found user!`);
    }
    await util.promisify(request.login).bind(request)(user);
    return user as any;
  }
}
