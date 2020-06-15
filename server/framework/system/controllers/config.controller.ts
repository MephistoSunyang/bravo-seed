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
  ConfigAndCountModel,
  ConfigModel,
  CreatedConfigModel,
  QueryConfigAndCountModel,
  QueryConfigModel,
  UpdatedConfigModel,
} from '../models';
import { ConfigService } from '../services';

@ApiTags('system.configs')
@Controller('api/v1/system/configs')
@UsePipes(ValidatorPipe)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ConfigAndCountModel,
  })
  @Get('/andCount')
  public async getConfigsAndCount(
    @Query() queries: QueryConfigAndCountModel,
  ): Promise<ConfigAndCountModel> {
    const result = await this.configService._getConfigsAndCount(queries);
    return result;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ConfigModel,
    isArray: true,
  })
  @Get()
  public async getConfigs(@Query() queries: QueryConfigModel): Promise<ConfigModel[]> {
    const configModels = await this.configService._getConfigs(queries);
    return configModels;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ConfigModel,
  })
  @Get(':id')
  public async getConfigById(@Param('id', new ParseIntPipe()) id: number): Promise<ConfigModel> {
    const configModel = await this.configService._getConfigById(id);
    return configModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ConfigModel,
  })
  @Post()
  public async createConfig(@Body() createdConfigModel: CreatedConfigModel): Promise<ConfigModel> {
    const configModel = await this.configService._createConfig(createdConfigModel);
    return configModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ConfigModel,
  })
  @Put(':id')
  public async updateConfig(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedConfigModel: UpdatedConfigModel,
  ): Promise<ConfigModel> {
    const configModel = await this.configService._updateConfigById(id, updatedConfigModel);
    return configModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: ConfigModel,
  })
  @HttpCode(HTTP_STATUS_CODE_ENUM.NO_CONTENT)
  @Delete(':id')
  public async deleteConfig(@Param('id', new ParseIntPipe()) id: number): Promise<ConfigModel> {
    const configModel = await this.configService._deleteConfigById(id);
    return configModel;
  }
}
