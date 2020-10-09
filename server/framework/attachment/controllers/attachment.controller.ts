import { HTTP_STATUS_CODE_ENUM, IFile, IRequest, IResponse } from '@bravo/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Response,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ActionGuard,
  DisableActionGuard,
  DisablePermissionGuard,
  ISelectOption,
  PermissionGuard,
  Permissions,
} from '../../system';
import { ATTACHMENT_STORAGE_TYPE_ENUM, DOWNLOAD_ATTACHMENT_TYPE_ENUM } from '../enums';
import { AttachmentAndCountModel, AttachmentModel, QueryAttachmentAndCountModel } from '../models';
import { AttachmentService } from '../services';

@ApiTags('system.attachments')
@ApiBearerAuth()
@Controller()
@UseGuards(PermissionGuard, ActionGuard)
@Permissions('system.attachments')
export class AttachmentController {
  constructor(public readonly attachmentService: AttachmentService) {}

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: String,
    isArray: true,
  })
  @Get('api/v1/attachments/storageTypes')
  public getAttachmentStorageTypes(): ISelectOption[] {
    const storageTypes = this.attachmentService._getAttachmentStorageTypes();
    return storageTypes;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: AttachmentAndCountModel,
  })
  @Get('api/v1/attachments/andCount')
  public async getAttachmentsAndCount(
    @Query() queries: QueryAttachmentAndCountModel,
  ): Promise<AttachmentAndCountModel> {
    const result = await this.attachmentService._getAttachmentsAndCount(queries);
    return result;
  }

  @ApiResponse({
    status: HTTP_STATUS_CODE_ENUM.OK,
    type: AttachmentModel,
  })
  @HttpCode(HTTP_STATUS_CODE_ENUM.NO_CONTENT)
  @Delete('api/v1/attachments/:id')
  public async deleteAttachmentById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<AttachmentModel> {
    const deletedAttachment = await this.attachmentService._deleteAttachmentById(id);
    return deletedAttachment;
  }

  @DisablePermissionGuard()
  @DisableActionGuard()
  @Get('resources/*')
  public async downloadAttachmentByPath(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ) {
    const [type, path] = await this.attachmentService._downloadAttachmentByPath(
      request.originalUrl,
    );
    type === DOWNLOAD_ATTACHMENT_TYPE_ENUM.FILE ? response.sendFile(path) : response.redirect(path);
  }

  @Post('api/v1/attachments')
  @UseInterceptors(FileInterceptor('file'))
  public async createAttachment(
    @UploadedFile() file: IFile,
    @Body('storageType') storageType?: ATTACHMENT_STORAGE_TYPE_ENUM,
  ): Promise<AttachmentModel> {
    const attachment = await this.attachmentService._uploadAttachment(file, storageType);
    return attachment;
  }

  @Post('api/v1/attachments/bulk')
  @UseInterceptors(FilesInterceptor('files'))
  public async createAttachments(
    @UploadedFiles() files: IFile[],
    @Body('storageType') storageType?: ATTACHMENT_STORAGE_TYPE_ENUM,
  ): Promise<AttachmentModel[]> {
    const attachments = await this.attachmentService._uploadAttachments(files, storageType);
    return attachments;
  }
}
