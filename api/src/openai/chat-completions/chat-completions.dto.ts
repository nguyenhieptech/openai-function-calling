import { PartialType } from '@nestjs/swagger';

export class CreateChatCompletionsDto {}

export class UpdateChatCompletionsDto extends PartialType(CreateChatCompletionsDto) {}
