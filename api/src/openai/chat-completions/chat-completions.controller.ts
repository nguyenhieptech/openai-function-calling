import { Body, Controller, Post } from '@nestjs/common';
import { CreateChatCompletionsDto } from './chat-completions.dto';
import { ChatCompletionsService } from './chat-completions.service';

@Controller('chat-completions')
export class ChatCompletionsController {
  constructor(private readonly chatCompletionsService: ChatCompletionsService) {}
  // https://platform.openai.com/docs/api-reference/chat/create

  @Post()
  create(@Body() createChatCompletionsDto: CreateChatCompletionsDto) {
    return this.chatCompletionsService.create(createChatCompletionsDto.messages);
  }
}
