import { Module } from '@nestjs/common';
import { AssistantFileController } from './assistant-files.controller';
import { AssistantFileService } from './assistant-files.service';

@Module({
  controllers: [AssistantFileController],
  providers: [AssistantFileService],
})
export class AssistantFileModule {}
