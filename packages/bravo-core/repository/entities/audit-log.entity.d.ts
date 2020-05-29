import { AUDIT_LOG_ACTION_ENUM } from '../enums';
export declare class AuditLogEntity {
    id: number;
    schemaName: string;
    tableName: string;
    action: AUDIT_LOG_ACTION_ENUM;
    content: string;
    createdUserId: string | null;
    createdDate: Date;
}
