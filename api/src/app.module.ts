import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssistantFileModule } from './openai/assistant-files/assistant-files.module';
import { AssistantModule } from './openai/assistants/assistants.module';
import { ChatCompletionsModule } from './openai/chat-completions/chat-completions.module';
import { MessagesModule } from './openai/messages/messages.module';
import { OpenAIModule } from './openai/openai.module';
import { RunModule } from './openai/runs/runs.module';
import { ThreadModule } from './openai/threads/threads.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OpenAIModule,
    AssistantModule,
    ChatCompletionsModule,
    WeatherModule,
    AssistantFileModule,
    MessagesModule,
    RunModule,
    ThreadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
