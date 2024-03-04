import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ToolOutputsDto } from './runs.dto';
import { RunService } from './runs.service';

@Controller('threads/runs')
export class RunController {
  constructor(private readonly runService: RunService) {}
  // https://platform.openai.com/docs/api-reference/runs

  @Post()
  create(@Query('thread_id') threadId: string, @Query('run_id') runId: string) {
    return this.runService.create(threadId, runId);
  }

  @Get()
  listRuns(@Query('thread_id') threadId: string) {
    return this.runService.listRuns(threadId);
  }

  @Get('steps')
  listRunSteps(@Query('thread_id') threadId: string, @Query('run_id') runId: string) {
    return this.runService.listRunSteps(threadId, runId);
  }

  @Post('cancel')
  cancel(@Query('thread_id') threadId: string, @Query('run_id') runId: string) {
    return this.runService.cancel(threadId, runId);
  }

  @Post('submit-tool-output')
  submitToolOutputsToRun(
    @Query('thread_id') threadId: string,
    @Query('run_id') runId: string,
    @Body() submitToolsOutput: ToolOutputsDto
  ) {
    return this.runService.submitToolOutputsToRun(threadId, runId, submitToolsOutput);
  }
}
