import { Controller, Get, Param, Response, UseGuards } from '@nestjs/common';
import { UserActionGuard } from '../guards';
import { LogService } from '../services';

@UseGuards(UserActionGuard)
@Controller('api/v1/system/logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

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
