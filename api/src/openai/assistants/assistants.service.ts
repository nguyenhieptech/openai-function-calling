import { OpenAIService } from '@/openai/openai.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAssistantDto } from './assistants.dto';

@Injectable()
export class AssistantService {
  constructor(private readonly openaiService: OpenAIService) {}

  async create() {
    // https://platform.openai.com/docs/api-reference/assistants/createAssistant
    try {
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
      console.log(assistant);

      return { assistant };
    } catch (e) {
      return { error: e };
    }
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

    try {
      const assistant = await this.openaiService.beta.assistants.retrieve(assistantId);
      return assistant;
    } catch (error) {
      throw new BadRequestException({ error: 'Expected assistant id' });
    }
  }

  async modify(assistantId: string, fileId: string) {
    if (!assistantId) {
      throw new NotFoundException({ error: 'No assistant id provided' });
    }

    if (!fileId) {
      throw new NotFoundException({ error: 'No file id provided' });
    }

    // https://platform.openai.com/docs/api-reference/assistants/modifyAssistant
    try {
      const updatedAssistant = await this.openaiService.beta.assistants.update(assistantId, {
        file_ids: [fileId],
      });
      console.log(updatedAssistant);

      return { assistant: updatedAssistant };
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  }

  async remove(assistantId: string) {
    if (!assistantId) {
      throw new NotFoundException({ error: 'No id provided' });
    }

    // https://platform.openai.com/docs/api-reference/assistants/deleteAssistant
    try {
      const response = await this.openaiService.beta.assistants.del(assistantId);
      return response;
    } catch (e) {
      return { error: e };
    }
  }
}
