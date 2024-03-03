import { Module } from '@nestjs/common';
import { RunController } from './runs.controller';
import { RunService } from './runs.service';

@Module({
  controllers: [RunController],
  providers: [RunService],
})
export class RunModule {}
