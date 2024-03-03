import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { UpdateAssistantDto } from './assistants.dto';
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

  @Get()
  retrieve(@Query('assistant_id') id: string) {
    return this.assistantService.retrieve(id);
  }

  @Post()
  modify(@Query('assistant_id') assistantId: string, @Query('file_id') fileId: string) {
    return this.assistantService.modify(assistantId, fileId);
  }

  @Delete()
  delete(@Query('assistant_id') assistantId: string) {
    return this.assistantService.remove(assistantId);
  }
}
