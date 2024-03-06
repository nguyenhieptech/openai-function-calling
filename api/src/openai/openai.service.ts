import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

// https://platform.openai.com/docs/api-reference/introduction
@Injectable()
export class OpenAIService extends OpenAI {}
