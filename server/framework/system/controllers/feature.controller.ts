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
import {
  CreatedFeatureModel,
  FeatureAndCountModel,
  FeatureModel,
  QueryFeatureAndCountModel,
  QueryFeatureModel,
  UpdatedFeatureModel,
} from '../models';
import { FeatureService } from '../services';

@ApiTags('system.features')
@ApiBearerAuth()
@Controller('api/v1/system/features')
@UsePipes(ValidatorPipe)
@UseGuards(PermissionGuard, ActionGuard)
@Permissions('system.features')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: FeatureAndCountModel,
  })
  @Get('/andCount')
  public async getFeaturesAndCount(
    @Query() queries: QueryFeatureAndCountModel,
  ): Promise<FeatureAndCountModel> {
    const result = await this.featureService._getFeaturesAndCount(queries);
    return result;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: FeatureModel,
    isArray: true,
  })
  @Get()
  public async getFeatures(@Query() queries: QueryFeatureModel): Promise<FeatureModel[]> {
    const featureModels = await this.featureService._getFeatures(queries);
    return featureModels;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: FeatureModel,
  })
  @Get(':id')
  public async getFeatureById(@Param('id', new ParseIntPipe()) id: number): Promise<FeatureModel> {
    const featureModel = await this.featureService._getFeatureById(id);
    return featureModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: FeatureModel,
  })
  @Post()
  public async createFeature(
    @Body() createdFeatureModel: CreatedFeatureModel,
  ): Promise<FeatureModel> {
    const featureModel = await this.featureService._createFeature(createdFeatureModel);
    return featureModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: FeatureModel,
  })
  @Put(':id')
  public async updateFeature(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedFeatureModel: UpdatedFeatureModel,
  ): Promise<FeatureModel> {
    const featureModel = await this.featureService._updateFeatureById(id, updatedFeatureModel);
    return featureModel;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: FeatureModel,
  })
  @HttpCode(HTTP_STATUS_CODE_ENUM.NO_CONTENT)
  @Delete(':id')
  public async deleteFeature(@Param('id', new ParseIntPipe()) id: number): Promise<FeatureModel> {
    const featureModel = await this.featureService._deleteFeatureById(id);
    return featureModel;
  }
}
