import { IntersectionType } from '@nestjs/swagger';
import { BaseQueryAndCountModel } from '../../system';
import { QueryValidatorModel } from '../../validator';
import { AttachmentModel } from './attachment.model';
import { QueryAttachmentModel } from './query-attachment.model';

@QueryValidatorModel(AttachmentModel)
export class QueryAttachmentAndCountModel extends IntersectionType(
  QueryAttachmentModel,
  BaseQueryAndCountModel,
) {}
