import { AuditLog } from '@bravo/core';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ACTION_METHOD_ENUM } from '../enums';

@Entity({ schema: 'system', name: 'actions' })
@AuditLog()
export class ActionEntity extends BaseEntity {
  @Column('varchar', { nullable: true })
  public code: string | null;

  @Column('nvarchar')
  public name: string;

  @Column('varchar')
  public method: ACTION_METHOD_ENUM;

  @Column('varchar')
  public path: string;

  @Column('nvarchar', { nullable: true, length: 500 })
  public comment: string | null;
}
