import { BadRequestException, Injectable } from '@nestjs/common';
import { OpenAIService } from '../openai.service';
import { ToolOutputsDto } from './runs.dto';

@Injectable()
export class RunService {
  constructor(private readonly openaiService: OpenAIService) {}
  // https://platform.openai.com/docs/api-reference/runs

  async create(threadId: string, assistantId: string) {
    if (!threadId) {
      throw new BadRequestException('No thread id provided');
    }

    if (!assistantId) {
      throw new BadRequestException('No assistant id provided');
    }

    const run = await this.openaiService.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    return run;
  }

  async listRuns(threadId: string) {
    if (!threadId) {
      throw new BadRequestException('No thread id provided');
    }

    const runs = await this.openaiService.beta.threads.runs.list(threadId);
    return runs;
  }

  async listRunSteps(threadId: string, runId: string) {
    if (!threadId) {
      throw new BadRequestException('No thread id provided');
    }

    if (!runId) {
      throw new BadRequestException('No run id provided');
    }

    const runStep = await this.openaiService.beta.threads.runs.steps.list(threadId, runId);
    return runStep;
  }

  async cancel(threadId: string, runId: string) {
    if (!threadId) {
      throw new BadRequestException('No thread id provided');
    }

    if (!runId) {
      throw new BadRequestException('No run id provided');
    }

    const run = await this.openaiService.beta.threads.runs.cancel(threadId, runId);
    return run;
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

    return 'This action adds a new run';
  }
}
