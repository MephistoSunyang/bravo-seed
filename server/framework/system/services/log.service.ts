import { getRootPath } from '@bravo/core';
import { Injectable } from '@nestjs/common';
import fs from 'fs';

@Injectable()
export class LogService {
  public getLogs() {
    const logsFolderPath = getRootPath('logs');
    const logs = fs
      .readdirSync(logsFolderPath)
      .filter((log) => log.endsWith('.log'))
      .reverse();
    return logs;
  }

  public downloadLogByName(name: string): string {
    const filePath = getRootPath('logs', name);
    return filePath;
  }
}
