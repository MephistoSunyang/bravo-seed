import { HTTP_STATUS_CODE_ENUM } from '@bravo/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserId } from '../../passport';
import { ValidatorPipe } from '../../validator';
import { Permissions } from '../decorators';
import { ActionGuard, PermissionGuard } from '../guards';
import { ISelectOption } from '../interfaces';
import {
  CreatedUserModel,
  MenuModel,
  QueryCurrentUserMenuModel,
  QueryUserAndCountModel,
  QueryUserModel,
  ReplaceUserPasswordModel,
  UpdatedUserModel,
  UserAndCountModel,
  UserModel,
} from '../models';
import { UserService } from '../services';

@ApiTags('system.users')
@ApiBearerAuth()
@Controller('api/v1/system/users')
@UsePipes(ValidatorPipe)
@UseGuards(PermissionGuard, ActionGuard)
@Permissions('system.users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: String,
    isArray: true,
  })
  @Get('types')
  public getUsersTypes(): ISelectOption[] {
    const providerTypes = this.userService._getUsersTypes();
    return providerTypes;
  }

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
    type: String,
  })
  @Get('current/username')
  public async getCurrentUserUsername(@UserId() userId: number): Promise<string> {
    const userModel = await this.userService._getUserById(userId);
    return userModel.username;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: MenuModel,
    isArray: true,
  })
  @Get('current/menus')
  public async getCurrentUserMenus(
    @UserId() userId: number,
    @Query() queryCurrentUserMenu: QueryCurrentUserMenuModel,
  ): Promise<MenuModel[]> {
    const userModel = await this.userService._getCurrentUserMenus(userId, queryCurrentUserMenu);
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
    type: ReplaceUserPasswordModel,
  })
  @Patch(':id/password')
  public async replaceUserPassword(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: ReplaceUserPasswordModel,
  ): Promise<UserModel> {
    const userModel = await this.userService._replacePassword(id, body.password, body.newPassword);
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
