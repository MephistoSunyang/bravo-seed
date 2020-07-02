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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActionGuard, Permission, PermissionGuard } from '../../authorization';
import { ValidatorPipe } from '../../validator';
import {
  CreatedPermissionModel,
  PermissionAndCountModel,
  PermissionModel,
  QueryPermissionAndCountModel,
  QueryPermissionModel,
  UpdatedPermissionModel,
} from '../models';
import { PermissionService } from '../services';

@ApiTags('system.permissions')
@Controller('api/v1/system/permissions')
@UsePipes(ValidatorPipe)
@UseGuards(PermissionGuard, ActionGuard)
@Permission('system.permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: PermissionAndCountModel,
  })
  @Get('/andCount')
  public async getPermissionsAndCount(
    @Query() queries: QueryPermissionAndCountModel,
  ): Promise<PermissionAndCountModel> {
    const result = await this.permissionService._getPermissionsAndCount(queries);
    return result;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: PermissionModel,
    isArray: true,
  })
  @Get()
  public async getPermissions(@Query() queries: QueryPermissionModel): Promise<PermissionModel[]> {
    const permissionModels = await this.permissionService._getPermissions(queries);
    return permissionModels;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: PermissionModel,
  })
  @Get(':id')
  public async getPermissionById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<PermissionModel> {
    const permissionModel = await this.permissionService._getPermissionById(id);
    return permissionModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: PermissionModel,
  })
  @Post()
  public async createPermission(
    @Body() createdPermissionModel: CreatedPermissionModel,
  ): Promise<PermissionModel> {
    const permissionModel = await this.permissionService._createPermission(createdPermissionModel);
    return permissionModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: PermissionModel,
  })
  @Put(':id')
  public async updatePermission(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedPermissionModel: UpdatedPermissionModel,
  ): Promise<PermissionModel> {
    const permissionModel = await this.permissionService._updatePermissionById(
      id,
      updatedPermissionModel,
    );
    return permissionModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: PermissionModel,
  })
  @HttpCode(HTTP_STATUS_CODE_ENUM.NO_CONTENT)
  @Delete(':id')
  public async deletePermission(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<PermissionModel> {
    const permissionModel = await this.permissionService._deletePermissionById(id);
    return permissionModel;
  }
}
