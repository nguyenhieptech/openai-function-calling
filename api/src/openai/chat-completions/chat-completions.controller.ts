import { Controller, Post } from '@nestjs/common';
import { ChatCompletionsService } from './chat-completions.service';

@Controller('chat-completions')
export class ChatCompletionsController {
  constructor(private readonly chatCompletionsService: ChatCompletionsService) {}
  // https://platform.openai.com/docs/api-reference/chat/create

  @Post()
  create() {
    return this.chatCompletionsService.create();
  }
}
