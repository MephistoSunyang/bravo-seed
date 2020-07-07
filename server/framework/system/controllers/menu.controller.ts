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
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatorPipe } from '../../validator';
import { Permissions } from '../decorators';
import { ActionGuard, PermissionGuard } from '../guards';
import { CreatedMenuModel, MenuModel, QueryMenuModel, UpdatedMenuModel } from '../models';
import { MenuService } from '../services';

@ApiTags('system.menus')
@ApiBearerAuth()
@Controller('api/v1/system/menus')
@UsePipes(ValidatorPipe)
@UseGuards(PermissionGuard, ActionGuard)
@Permissions('system.menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: MenuModel,
    isArray: true,
  })
  @Get()
  public async getMenus(@Query() queries: QueryMenuModel): Promise<MenuModel[]> {
    const menuModels = await this.menuService._getMenus(queries);
    return menuModels;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: MenuModel,
  })
  @Get(':id')
  public async getMenuById(@Param('id', new ParseIntPipe()) id: number): Promise<MenuModel> {
    const menuModel = await this.menuService._getMenuById(id);
    return menuModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: MenuModel,
  })
  @Post()
  public async createMenu(@Body() createdMenuModel: CreatedMenuModel): Promise<MenuModel> {
    const menuModel = await this.menuService._createMenu(createdMenuModel);
    return menuModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: MenuModel,
  })
  @Put(':id')
  public async updateMenu(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedMenuModel: UpdatedMenuModel,
  ): Promise<MenuModel> {
    const menuModel = await this.menuService._updateMenuById(id, updatedMenuModel);
    return menuModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: MenuModel,
  })
  @HttpCode(HTTP_STATUS_CODE_ENUM.NO_CONTENT)
  @Delete(':id')
  public async deleteMenu(@Param('id', new ParseIntPipe()) id: number): Promise<MenuModel> {
    const menuModel = await this.menuService._deleteMenuById(id);
    return menuModel;
  }
}
