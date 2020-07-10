import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'system', name: 'attachment-backups' })
export class AttachmentBackupEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public attachmentId: number;

  @Column('varbinary', { length: 'MAX' })
  public content: Buffer;
}
