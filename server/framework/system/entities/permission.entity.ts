import { AuditLog } from '@bravo/core';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ schema: 'system', name: 'permissions' })
@AuditLog()
export class PermissionEntity extends BaseEntity {
  @Column('varchar')
  public code: string;

  @Column('nvarchar')
  public name: string;

  @Column('nvarchar', { nullable: true, length: 500 })
  public comment: string | null;
}
