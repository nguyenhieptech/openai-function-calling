import { OpenAIService } from '@/openai/openai.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './messages.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly openaiService: OpenAIService) {}
  // https://platform.openai.com/docs/api-reference/messages

  async create(threadId: string, { message }: CreateMessageDto) {
    if (!threadId || !message) {
      throw new NotFoundException({ error: 'Invalid message' });
    }

    const threadMessage = await this.openaiService.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });
    return threadMessage;
  }

  async listMessages(threadId: string) {
    if (!threadId) {
      return Response.json({ error: 'No id provided' }, { status: 400 });
    }

    const response = await this.openaiService.beta.threads.messages.list(threadId);
    return response.data;
  }
}
