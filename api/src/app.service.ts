import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello OpenAI Assistant! Ready to listen to requests...';
  }
}
