import { PartialType } from '@nestjs/swagger';

export class CreateThreadDto {}

export class UpdateThreadDto extends PartialType(CreateThreadDto) {}
