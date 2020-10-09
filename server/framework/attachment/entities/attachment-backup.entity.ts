import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('SystemAttachmentBackupAttachmentIdIndex', ['attachmentId'], { unique: true })
@Entity({ schema: 'system', name: 'attachment-backups' })
export class AttachmentBackupEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public attachmentId: number;

  @Column('varbinary', { length: 'MAX' })
  public content: Buffer;
}
