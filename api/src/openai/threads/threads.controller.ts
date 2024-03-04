import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UpdateThreadDto } from './threads.dto';
import { ThreadService } from './threads.service';

@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

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
