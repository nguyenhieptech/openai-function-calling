import { Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AssistantService } from './assistants.service';

@Controller('assistants')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}
  // https://platform.openai.com/docs/api-reference/assistants

  @Post()
  create() {
    return this.assistantService.create();
  }

  @Get()
  listAll() {
    return this.assistantService.listAll();
  }

  @Get(':id')
  retrieve(@Param('id') assistantId: string) {
    return this.assistantService.retrieve(assistantId);
  }

  @Put(':id')
  modify(@Param('id') assistantId: string, @Query('file_id') fileId: string) {
    return this.assistantService.modify(assistantId, fileId);
  }

  @Delete(':id')
  delete(@Param('id') assistantId: string) {
    return this.assistantService.remove(assistantId);
  }
}
