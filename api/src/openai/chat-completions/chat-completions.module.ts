import { WeatherModule } from '@/weather/weather.module';
import { Module } from '@nestjs/common';
import { ChatCompletionsController } from './chat-completions.controller';
import { ChatCompletionsService } from './chat-completions.service';

@Module({
  imports: [WeatherModule],
  controllers: [ChatCompletionsController],
  providers: [ChatCompletionsService],
})
export class ChatCompletionsModule {}
