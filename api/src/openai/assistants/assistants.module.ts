import { Module } from '@nestjs/common';
import { AssistantController } from './assistants.controller';
import { AssistantService } from './assistants.service';

@Module({
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
