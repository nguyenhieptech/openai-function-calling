import { PartialType } from '@nestjs/swagger';
import OpenAI from 'openai';

export class CreateRunDto {}

export class UpdateRunDto extends PartialType(CreateRunDto) {}

export type ToolOutputsDto = OpenAI.Chat.Completions.ChatCompletionTool[];
