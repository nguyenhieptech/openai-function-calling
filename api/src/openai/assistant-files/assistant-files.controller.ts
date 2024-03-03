import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { AssistantFileService } from './assistant-files.service';

@Controller('assistant-files')
export class AssistantFileController {
  constructor(private readonly assistantFileService: AssistantFileService) {}
  // https://platform.openai.com/docs/api-reference/assistants

  @Post()
  create(@Query('assistant_id') assistantId: string, @Query('file_id') fileId: string) {
    return this.assistantFileService.create(assistantId, fileId);
  }

  @Get()
  listAll(@Query('assistant_id') assistantId: string) {
    return this.assistantFileService.listAll(assistantId);
  }

  @Get()
  retrieve(@Query('assistant_id') assistantId: string, @Query('file_id') fileId: string) {
    return this.assistantFileService.retrieve(assistantId, fileId);
  }

  @Delete(':id')
  remove(@Query('assistant_id') assistantId: string, @Query('file_id') fileId: string) {
    return this.assistantFileService.remove(assistantId, fileId);
  }
}
