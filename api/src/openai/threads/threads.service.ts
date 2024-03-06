import { OpenAIService } from '@/openai/openai.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThreadService {
  constructor(private readonly openaiService: OpenAIService) {}
  // https://platform.openai.com/docs/api-reference/threads

  async create() {
    const emptyThread = await this.openaiService.beta.threads.create();
    return emptyThread;
  }

  async retrieve(threadId: string) {
    const thread = await this.openaiService.beta.threads.retrieve(threadId);
    return thread;
  }

  async modify(threadId: string) {
    const modifiedThread = await this.openaiService.beta.threads.update(threadId, {});
    return modifiedThread;
  }

  async delete(threadId: string) {
    const deletedThread = await this.openaiService.beta.threads.del(threadId);
    return deletedThread;
  }
}
