import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OpenAIService } from '../openai.service';
import { ToolOutputsDto } from './runs.dto';

@Injectable()
export class RunService {
  constructor(private readonly openaiService: OpenAIService) {}

  async create(threadId: string, assistantId: string) {
    if (!threadId) {
      throw new BadRequestException('No thread id provided');
    }

    if (!assistantId) {
      throw new BadRequestException('No assistant id provided');
    }

    // https://platform.openai.com/docs/api-reference/runs/createRun
    try {
      const run = await this.openaiService.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });
      return run;
    } catch (e) {
      //TODO: handle error
      throw new BadRequestException('There was some errors...');
    }
  }

  async listRuns(threadId: string) {
    if (!threadId) {
      throw new BadRequestException('No thread id provided');
    }

    // https://platform.openai.com/docs/api-reference/runs/listRuns
    try {
      const runs = await this.openaiService.beta.threads.runs.list(threadId);
      return runs;
    } catch (error) {
      //TODO: handle error
      throw new NotFoundException('Not found');
    }
  }

  async listRunSteps(threadId: string, runId: string) {
    if (!threadId) {
      throw new BadRequestException('No thread id provided');
    }

    if (!runId) {
      throw new BadRequestException('No run id provided');
    }

    // https://platform.openai.com/docs/api-reference/runs/listRunSteps
    try {
      const runStep = await this.openaiService.beta.threads.runs.steps.list(threadId, runId);
      return runStep;
    } catch (error) {
      //TODO: handle error
      throw new NotFoundException('Not found');
    }
  }

  async cancel(threadId: string, runId: string) {
    if (!threadId) {
      throw new BadRequestException('No thread id provided');
    }

    if (!runId) {
      throw new BadRequestException('No run id provided');
    }

    // https://platform.openai.com/docs/api-reference/runs/cancelRun
    try {
      const run = await this.openaiService.beta.threads.runs.cancel(threadId, runId);
      return run;
    } catch (e) {
      //TODO: handle error
      throw new NotFoundException(e);
    }
  }

  async submitToolOutputsToRun(threadId: string, runId: string, toolOutputs: ToolOutputsDto) {
    if (!threadId) {
      throw new BadRequestException('No thread id provided');
    }

    if (!runId) {
      throw new BadRequestException('No run id provided');
    }

    if (!toolOutputs) {
      throw new BadRequestException('No toolOutputs provided');
    }

    // https://platform.openai.com/docs/api-reference/runs/submitToolOutputs
    return 'This action adds a new run';
  }
}
