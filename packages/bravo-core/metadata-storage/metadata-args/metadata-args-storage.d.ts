import { IAuditLogMetadataArgs } from '../interfaces';
export declare class MetadataArgsStorage {
    auditLogs: IAuditLogMetadataArgs[];
    findAuditLog(target: Function | string): IAuditLogMetadataArgs | undefined;
}
