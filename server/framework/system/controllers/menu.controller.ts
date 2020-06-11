import { HTTP_STATUS_CODE_ENUM, ValidatorPipe } from '@bravo/core';
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
import {
  CreatedMenuModel,
  MenuAndCountModel,
  MenuModel,
  QueryMenuAndCountModel,
  QueryMenuModel,
  UpdatedMenuModel,
} from '../models';
import { MenuService } from '../services';

@ApiTags('system.menus')
@Controller('api/v1/system/menus')
@UsePipes(ValidatorPipe)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: MenuAndCountModel,
  })
  @Get('/andCount')
  public async getMenusAndCount(
    @Query() queries: QueryMenuAndCountModel,
  ): Promise<MenuAndCountModel> {
    const result = await this.menuService._getMenusAndCount(queries);
    return result;
  }

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
