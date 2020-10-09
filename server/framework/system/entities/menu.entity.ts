import { AuditLog } from '@bravo/core';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@AuditLog()
@Entity({ schema: 'system', name: 'menus' })
export class MenuEntity extends BaseEntity {
  @Column('varchar')
  public group: string;

  @Column('int', { default: 0 })
  public parentId: number;

  @Column('int', { default: 0 })
  public sort: number;

  @Column('nvarchar')
  public name: string;

  @Column('nvarchar', { nullable: true })
  public icon: string | null;

  @Column('nvarchar', { nullable: true })
  public path: string | null;

  @Column('bit', { default: true })
  public visible: boolean;

  @Column('nvarchar', { nullable: true, length: 500 })
  public comment: string | null;
}
