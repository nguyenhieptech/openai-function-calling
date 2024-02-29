import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { UpdateAssistantDto } from './dto/update-assistant.dto';

@Injectable()
export class AssistantService {
  private openai = new OpenAI();

  async create() {
    // https://platform.openai.com/docs/api-reference/assistants/createAssistant
    try {
      const assistant = await this.openai.beta.assistants.create({
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
      console.log(e);
      return Response.json({ error: e });
    }
  }

  async findAll() {
    try {
      const response = await this.openai.beta.assistants.list({
        order: 'desc',
        limit: 10,
      });

      const assistants = response.data;
      console.log(assistants);

      return { assistants };
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  }

  async findOne(id: string) {
    return `This action returns a #${id} assistant`;
  }

  async update(id: string, updateAssistantDto: UpdateAssistantDto) {
    return `This action updates a #${id} assistant`;
  }

  async remove(id: string) {
    if (!id) {
      throw new NotFoundException({ error: 'No id provided' });
    }

    // https://platform.openai.com/docs/api-reference/assistants/deleteAssistant
    try {
      const response = await this.openai.beta.assistants.del(id);
      console.log(response);

      return response;
    } catch (e) {
      console.log(e);
      return Response.json({ error: e });
    }
  }
}
