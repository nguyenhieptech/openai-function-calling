import { PartialType } from '@nestjs/swagger';
import OpenAI from 'openai';

export class CreateChatCompletionsDto {
  // https://sdk.vercel.ai/docs/guides/frameworks/nextjs-app#route-handlers
  // The body receives an object with messages property
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
}

export class UpdateChatCompletionsDto extends PartialType(CreateChatCompletionsDto) {}
