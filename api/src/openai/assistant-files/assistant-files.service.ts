import { OpenAIService } from '@/openai/openai.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AssistantFileService {
  constructor(private readonly openaiService: OpenAIService) {}
  // https://platform.openai.com/docs/api-reference/assistants

  async create(assistantId: string, fileId: string) {
    const createdAssistantFile = await this.openaiService.beta.assistants.files.create(
      assistantId,
      {
        file_id: fileId,
      }
    );

    if (createdAssistantFile) {
      throw new BadRequestException(
        'A file with this id already existed. Please choose a new one.'
      );
    }

    return createdAssistantFile;
  }

  async listAll(assistantId: string) {
    const assistantFiles = await this.openaiService.beta.assistants.files.list(assistantId);
    return assistantFiles;
  }

  async retrieve(assistantId: string, fileId: string) {
    const assistantFile = await this.openaiService.beta.assistants.files.retrieve(
      assistantId,
      fileId
    );

    if (!assistantFile) {
      throw new NotFoundException();
    }

    return assistantFile;
  }

  async remove(assistantId: string, fileId: string) {
    const deletedAssistantFile = await this.openaiService.beta.assistants.files.del(
      assistantId,
      fileId
    );
    return deletedAssistantFile;
  }
}
