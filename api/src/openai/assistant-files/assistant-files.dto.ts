import { PartialType } from '@nestjs/swagger';

export class CreateAssistantFileDto {}

export class UpdateAssistantFileDto extends PartialType(CreateAssistantFileDto) {}
