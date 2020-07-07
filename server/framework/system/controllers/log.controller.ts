import { HTTP_STATUS_CODE_ENUM } from '@bravo/core';
import { Controller, Get, Param, Response, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatorPipe } from '../../validator';
import { Permissions } from '../decorators';
import { ActionGuard, PermissionGuard } from '../guards';
import { LogService } from '../services';

@ApiTags('system.logs')
@ApiBearerAuth()
@Controller('api/v1/system/logs')
@UsePipes(ValidatorPipe)
@UseGuards(PermissionGuard, ActionGuard)
@Permissions('system.logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: String,
    isArray: true,
  })
  @Get()
  public getLogs() {
    const logs = this.logService.getLogs();
    return logs;
  }

  @Get(':name')
  public getSingleLog(@Response() response, @Param('name') name: string) {
    const filePath = this.logService.downloadLogByName(name);
    response.download(filePath);
  }
}
