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
import { ValidatorPipe } from '../../validator';
import { UserActionGuard } from '../guards';
import {
  CreatedRoleGroupModel,
  QueryRoleGroupAndCountModel,
  QueryRoleGroupModel,
  RoleGroupAndCountModel,
  RoleGroupModel,
  UpdatedRoleGroupModel,
} from '../models';
import { RoleGroupService } from '../services';

@ApiTags('system.roleGroups')
@Controller('api/v1/system/roleGroups')
@UsePipes(ValidatorPipe)
@UseGuards(UserActionGuard)
export class RoleGroupController {
  constructor(private readonly roleGroupService: RoleGroupService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleGroupAndCountModel,
  })
  @Get('/andCount')
  public async getRoleGroupsAndCount(
    @Query() queries: QueryRoleGroupAndCountModel,
  ): Promise<RoleGroupAndCountModel> {
    const result = await this.roleGroupService._getRoleGroupsAndCount(queries);
    return result;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleGroupModel,
    isArray: true,
  })
  @Get()
  public async getRoleGroups(@Query() queries: QueryRoleGroupModel): Promise<RoleGroupModel[]> {
    const roleGroupModels = await this.roleGroupService._getRoleGroups(queries);
    return roleGroupModels;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleGroupModel,
  })
  @Get(':id')
  public async getRoleGroupById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<RoleGroupModel> {
    const roleGroupModel = await this.roleGroupService._getRoleGroupById(id);
    return roleGroupModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleGroupModel,
  })
  @Post()
  public async createRoleGroup(
    @Body() createdRoleGroupModel: CreatedRoleGroupModel,
  ): Promise<RoleGroupModel> {
    const roleGroupModel = await this.roleGroupService._createRoleGroup(createdRoleGroupModel);
    return roleGroupModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleGroupModel,
  })
  @Put(':id')
  public async updateRoleGroup(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedRoleGroupModel: UpdatedRoleGroupModel,
  ): Promise<RoleGroupModel> {
    const roleGroupModel = await this.roleGroupService._updateRoleGroupById(
      id,
      updatedRoleGroupModel,
    );
    return roleGroupModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: RoleGroupModel,
  })
  @HttpCode(HTTP_STATUS_CODE_ENUM.NO_CONTENT)
  @Delete(':id')
  public async deleteRoleGroup(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<RoleGroupModel> {
    const roleGroupModel = await this.roleGroupService._deleteRoleGroupById(id);
    return roleGroupModel;
  }
}
