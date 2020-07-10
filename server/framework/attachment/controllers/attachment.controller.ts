import { HTTP_STATUS_CODE_ENUM, IFile, IResponse } from '@bravo/core';
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
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ActionGuard,
  DisableActionGuard,
  DisablePermissionGuard,
  ISelectOption,
  PermissionGuard,
  Permissions,
} from '../../system';
import { ATTACHMENT_STORAGE_TYPE_ENUM } from '../enums';
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
  @Get('resources/:path')
  public async downloadAttachmentByPath(
    @Param('path') path: string,
    @Response() response: IResponse,
  ) {
    const url = await this.attachmentService._downloadAttachmentByPath(path);
    response.send(url);
  }

  @Post('api/v1/attachments')
  @UseInterceptors(FileInterceptor('files'))
  public async createAttachment(
    @UploadedFile() files: IFile[],
    @Body('storageType') storageType?: ATTACHMENT_STORAGE_TYPE_ENUM,
  ): Promise<AttachmentModel> {
    const attachment = await this.attachmentService._uploadAttachment(files[0], storageType);
    return attachment;
  }

  @Post('api/v1/attachments/bulk')
  @UseInterceptors(FileInterceptor('files'))
  public async createAttachments(
    @UploadedFile() files: IFile[],
    @Body('storageType') storageType?: ATTACHMENT_STORAGE_TYPE_ENUM,
  ): Promise<AttachmentModel[]> {
    const attachments = await this.attachmentService._uploadAttachments(files, storageType);
    return attachments;
  }
}
