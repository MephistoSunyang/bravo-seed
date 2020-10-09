import { RepositoryModule } from '@bravo/core';
import { Module } from '@nestjs/common';
import { LocalStorageAdapter } from './adapters';
import { AttachmentStorageContainer } from './containers';
import { AttachmentController } from './controllers';
import { AttachmentBackupEntity, AttachmentEntity } from './entities';
import { AttachmentBackupService, AttachmentService } from './services';

const entities = [AttachmentBackupEntity, AttachmentEntity];
const modules = [RepositoryModule.forFeature(entities)];
const controllers = [AttachmentController];
const containers = [AttachmentStorageContainer];
const adapters = [LocalStorageAdapter];
const services = [AttachmentBackupService, AttachmentService];
const providers = [...containers, ...adapters, ...services];

@Module({
  imports: [...modules],
  controllers,
  providers,
  exports: [...providers],
})
export class AttachmentModule {}
