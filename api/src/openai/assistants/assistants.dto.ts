import { PartialType } from '@nestjs/swagger';

export class CreateAssistantDto {
  name: string;
  instructions: string;
}

export class UpdateAssistantDto extends PartialType(CreateAssistantDto) {}
