import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'system', name: 'synchronize-database-logs' })
export class SynchronizeDatabaseLogEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar')
  public code: string;

  @Column('int')
  public version: number;

  @Column('varchar')
  public status: string;

  @Column('nvarchar', { default: '', length: 'MAX' })
  public exception: string;
}
