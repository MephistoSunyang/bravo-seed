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
  ActionAndCountModel,
  ActionModel,
  CreatedActionModel,
  QueryActionAndCountModel,
  QueryActionModel,
  UpdatedActionModel,
} from '../models';
import { ActionService } from '../services';

@ApiTags('system.actions')
@Controller('api/v1/system/actions')
@UsePipes(ValidatorPipe)
@UseGuards(PermissionGuard, ActionGuard)
@Permission('system.actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ActionAndCountModel,
  })
  @Get('/andCount')
  public async getActionsAndCount(
    @Query() queries: QueryActionAndCountModel,
  ): Promise<ActionAndCountModel> {
    const result = await this.actionService._getActionsAndCount(queries);
    return result;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ActionModel,
    isArray: true,
  })
  @Get()
  public async getActions(@Query() queries: QueryActionModel): Promise<ActionModel[]> {
    const actionModels = await this.actionService._getActions(queries);
    return actionModels;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ActionModel,
  })
  @Get(':id')
  public async getActionById(@Param('id', new ParseIntPipe()) id: number): Promise<ActionModel> {
    const actionModel = await this.actionService._getActionById(id);
    return actionModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ActionModel,
  })
  @Post()
  public async createAction(@Body() createdActionModel: CreatedActionModel): Promise<ActionModel> {
    const actionModel = await this.actionService._createAction(createdActionModel);
    return actionModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ActionModel,
  })
  @Put(':id')
  public async updateAction(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedActionModel: UpdatedActionModel,
  ): Promise<ActionModel> {
    const actionModel = await this.actionService._updateActionById(id, updatedActionModel);
    return actionModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ActionModel,
  })
  @HttpCode(HTTP_STATUS_CODE_ENUM.NO_CONTENT)
  @Delete(':id')
  public async deleteAction(@Param('id', new ParseIntPipe()) id: number): Promise<ActionModel> {
    const actionModel = await this.actionService._deleteActionById(id);
    return actionModel;
  }
}
