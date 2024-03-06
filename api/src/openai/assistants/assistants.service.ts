import { OpenAIService } from '@/openai/openai.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AssistantService {
  constructor(private readonly openaiService: OpenAIService) {}
  // https://platform.openai.com/docs/api-reference/assistants

  async create() {
    const assistant = await this.openaiService.beta.assistants.create({
      instructions: `
          You are a professional stock analyst.
          I will ask you questions about the stock market and you will answer them.
          You can use the documents I provide to you to help you answer the questions.
          If you're not 100% sure of the answer, you can say "I don't know".
        `,
      name: 'Mini Stock Analyst',
      tools: [{ type: 'retrieval' }],
      model: 'gpt-3.5-turbo',
    });
    return assistant;
  }

  async listAll() {
    const response = await this.openaiService.beta.assistants.list({
      order: 'desc',
      limit: 10,
    });
    const assistants = response.data;
    return assistants;
  }

  async retrieve(assistantId: string) {
    if (!assistantId) {
      throw new NotFoundException({ error: 'Not found assistant id' });
    }

    const assistant = await this.openaiService.beta.assistants.retrieve(assistantId);
    return assistant;
  }

  async modify(assistantId: string, fileId: string) {
    if (!assistantId) {
      throw new NotFoundException({ error: 'No assistant id provided' });
    }

    if (!fileId) {
      throw new NotFoundException({ error: 'No file id provided' });
    }

    const updatedAssistant = await this.openaiService.beta.assistants.update(assistantId, {
      file_ids: [fileId],
    });
    return updatedAssistant;
  }

  async remove(assistantId: string) {
    if (!assistantId) {
      throw new NotFoundException({ error: 'No id provided' });
    }

    const deletedAssistant = await this.openaiService.beta.assistants.del(assistantId);
    return deletedAssistant;
  }
}
