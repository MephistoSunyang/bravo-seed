import { EntityMetadata, ObjectLiteral, Repository } from 'typeorm';
import { AuditLogEntity } from '../entities';
import { IAuditLogAction } from '../interfaces';
export declare class AuditLogService<Entity extends ObjectLiteral> {
    private readonly auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLogEntity>);
    private getAuditLogModels;
    insert(metadata: EntityMetadata, action: IAuditLogAction, entities: Entity[]): Promise<void>;
    insert(metadata: EntityMetadata, action: IAuditLogAction, entity: Entity): Promise<void>;
}
