import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateMessageDto } from './messages.dto';
import { MessagesService } from './messages.service';

@Controller('threads/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  // https://platform.openai.com/docs/api-reference/messages

  @Post()
  create(@Query('thread_id') threadId: string, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(threadId, createMessageDto);
  }

  @Get()
  listMessages(@Query('thread_id') threadId: string) {
    return this.messagesService.listMessages(threadId);
  }
}
