import { HTTP_STATUS_CODE_ENUM } from '@bravo/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatorPipe } from '../../validator';
import {
  CreatedUserModel,
  QueryUserAndCountModel,
  QueryUserModel,
  UpdatedUserModel,
  UserAndCountModel,
  UserModel,
} from '../models';
import { UserService } from '../services';

@ApiTags('system.users')
@Controller('api/v1/system/users')
@UsePipes(ValidatorPipe)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: UserAndCountModel,
  })
  @Get('/andCount')
  public async getUsersAndCount(
    @Query() queries: QueryUserAndCountModel,
  ): Promise<UserAndCountModel> {
    const result = await this.userService._getUsersAndCount(queries);
    return result;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: UserModel,
    isArray: true,
  })
  @Get()
  public async getUsers(@Query() queries: QueryUserModel): Promise<UserModel[]> {
    const userModels = await this.userService._getUsers(queries);
    return userModels;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: UserModel,
  })
  @Get(':id')
  public async getUserById(@Param('id', new ParseIntPipe()) id: number): Promise<UserModel> {
    const userModel = await this.userService._getUserById(id);
    return userModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: UserModel,
  })
  @Post()
  public async createUser(@Body() createdUserModel: CreatedUserModel): Promise<UserModel> {
    const userModel = await this.userService._createUser(createdUserModel);
    return userModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: UserModel,
  })
  @Put(':id')
  public async updateUser(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedUserModel: UpdatedUserModel,
  ): Promise<UserModel> {
    const userModel = await this.userService._updateUserById(id, updatedUserModel);
    return userModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: UserModel,
  })
  @HttpCode(HTTP_STATUS_CODE_ENUM.NO_CONTENT)
  @Delete(':id')
  public async deleteUser(@Param('id', new ParseIntPipe()) id: number): Promise<UserModel> {
    const userModel = await this.userService._deleteUserById(id);
    return userModel;
  }
}
