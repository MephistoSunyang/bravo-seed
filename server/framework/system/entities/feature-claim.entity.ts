import { AuditLog } from '@bravo/core';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FEATURE_CLAIM_TYPE_ENUM } from '../enums';
import { FeatureEntity } from './feature.entity';

@Entity({ schema: 'system', name: 'feature-claims' })
@AuditLog()
export class FeatureClaimEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public featureId: number;

  @Column('varchar')
  public type: FEATURE_CLAIM_TYPE_ENUM;

  @Column('varchar')
  public key: string;

  @JoinColumn({ name: 'featureId' })
  @ManyToOne(() => FeatureEntity)
  public feature?: FeatureEntity;
}
