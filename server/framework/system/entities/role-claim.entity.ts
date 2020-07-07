import { AuditLog } from '@bravo/core';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ROLE_CLAIM_TYPE_ENUM } from '../enums';
import { RoleEntity } from './role.entity';

@Entity({ schema: 'system', name: 'role-claims' })
@AuditLog()
export class RoleClaimEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public roleId: number;

  @Column('varchar')
  public type: ROLE_CLAIM_TYPE_ENUM;

  @Column('varchar')
  public key: string;

  @JoinColumn({ name: 'roleId' })
  @ManyToOne(() => RoleEntity)
  public role?: RoleEntity;
}
