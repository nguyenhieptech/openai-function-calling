import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ThreadService } from './threads.service';

@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}
  // https://platform.openai.com/docs/api-reference/threads

  @Post()
  create() {
    return this.threadService.create();
  }

  @Get(':id')
  retrieve(@Param('id') threadId: string) {
    return this.threadService.retrieve(threadId);
  }

  @Patch(':id')
  modify(@Param('id') threadId: string) {
    return this.threadService.modify(threadId);
  }

  @Delete(':id')
  delete(@Param('id') threadId: string) {
    return this.threadService.delete(threadId);
  }
}
