import { WeatherModule } from '@/weather/weather.module';
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [WeatherModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
