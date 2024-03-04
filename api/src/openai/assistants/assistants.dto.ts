import { PartialType } from '@nestjs/swagger';

export class CreateAssistantDto {}

export class UpdateAssistantDto extends PartialType(CreateAssistantDto) {}
