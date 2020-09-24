import { AuditLog } from '@bravo/core';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { USER_CLAIM_TYPE_ENUM } from '../enums';
import { UserEntity } from './user.entity';

@Entity({ schema: 'system', name: 'user-claims' })
@AuditLog()
export class RoleClaimEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public userId: number;

  @Column('varchar')
  public type: USER_CLAIM_TYPE_ENUM;

  @Column('varchar')
  public key: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => UserEntity)
  public user?: UserEntity;
}
