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
  CreatedRoleModel,
  QueryRoleAndCountModel,
  QueryRoleModel,
  RoleAndCountModel,
  RoleModel,
  UpdatedRoleModel,
} from '../models';
import { RoleService } from '../services';

@ApiTags('system.roles')
@Controller('api/v1/system/roles')
@UsePipes(ValidatorPipe)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleAndCountModel,
  })
  @Get('/andCount')
  public async getRolesAndCount(
    @Query() queries: QueryRoleAndCountModel,
  ): Promise<RoleAndCountModel> {
    const result = await this.roleService._getRolesAndCount(queries);
    return result;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleModel,
    isArray: true,
  })
  @Get()
  public async getRoles(@Query() queries: QueryRoleModel): Promise<RoleModel[]> {
    const roleModels = await this.roleService._getRoles(queries);
    return roleModels;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleModel,
  })
  @Get(':id')
  public async getRoleById(@Param('id', new ParseIntPipe()) id: number): Promise<RoleModel> {
    const roleModel = await this.roleService._getRoleById(id);
    return roleModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleModel,
  })
  @Post()
  public async createRole(@Body() createdRoleModel: CreatedRoleModel): Promise<RoleModel> {
    const roleModel = await this.roleService._createRole(createdRoleModel);
    return roleModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleModel,
  })
  @Put(':id')
  public async updateRole(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedRoleModel: UpdatedRoleModel,
  ): Promise<RoleModel> {
    const roleModel = await this.roleService._updateRoleById(id, updatedRoleModel);
    return roleModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleModel,
  })
  @HttpCode(HTTP_STATUS_CODE_ENUM.NO_CONTENT)
  @Delete(':id')
  public async deleteRole(@Param('id', new ParseIntPipe()) id: number): Promise<RoleModel> {
    const roleModel = await this.roleService._deleteRoleById(id);
    return roleModel;
  }
}
