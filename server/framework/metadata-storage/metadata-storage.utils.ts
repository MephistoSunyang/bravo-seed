import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { BravoFrameworkMetadataArgsStorage } from './metadata-args';

export function getBravoFrameworkMetadataArgsStorage(): BravoFrameworkMetadataArgsStorage {
  const globalScope = PlatformTools.getGlobalVariable();
  if (!globalScope.bravoFrameworkMetadataArgsStorage) {
    globalScope.bravoFrameworkMetadataArgsStorage = new BravoFrameworkMetadataArgsStorage();
  }
  return globalScope.bravoFrameworkMetadataArgsStorage;
}
