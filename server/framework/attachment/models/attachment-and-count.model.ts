import { DataAndCountModelType } from '../../validator';
import { AttachmentModel } from './attachment.model';

export class AttachmentAndCountModel extends DataAndCountModelType(AttachmentModel) {}
