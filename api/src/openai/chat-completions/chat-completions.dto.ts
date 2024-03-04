import { PartialType } from '@nestjs/swagger';

export class CreateChatCompletionsDto {
  content: string;
}

export class UpdateChatCompletionsDto extends PartialType(CreateChatCompletionsDto) {}
