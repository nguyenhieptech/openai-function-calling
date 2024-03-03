import { PartialType } from '@nestjs/swagger';

export class CreateMessageDto {
  message: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
