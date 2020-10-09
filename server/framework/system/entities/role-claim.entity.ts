import { AuditLog } from '@bravo/core';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ROLE_CLAIM_TYPE_ENUM } from '../enums';
import { RoleEntity } from './role.entity';

@AuditLog()
@Index('SystemRoleClaimRoleIdIndex', ['roleId'])
@Index('SystemRoleClaimTypeIndex', ['type'])
@Index('SystemRoleClaimKeyIndex', ['key'])
@Entity({ schema: 'system', name: 'role-claims' })
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
