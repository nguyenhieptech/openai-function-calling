import { OpenAIService } from '@/openai/openai.service';
import { WeatherService } from '@/weather/weather.service';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatCompletionsService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly openaiService: OpenAIService
  ) {}

  async create() {
    // https://platform.openai.com/docs/guides/function-calling/parallel-function-calling
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: "I mean what's the weather like in Tokyo?",
      },
    ];

    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_current_weather',
          description: 'Get the current weather in a given location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
              unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
            },
            required: ['location'],
          },
        },
      },
    ];

    const firstResponse = await this.openaiService.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: messages,
      tools: tools,
    });

    const responseMessage = firstResponse.choices[0].message;

    // Step 2: check if the model wanted to call a function
    const toolCalls = responseMessage.tool_calls!;

    if (responseMessage.tool_calls) {
      // Step 3: call the function
      // Note: the JSON response may not always be valid; be sure to handle errors
      const availableFunctions: Record<string, Function> = {
        get_current_weather: this.weatherService.findAll,
      };
      // Extend conversation with assistant's reply
      // {
      //   role: 'assistant',
      //   content: 'Assistant reply',
      // }
      messages.push(responseMessage);

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = functionToCall(functionArgs.location, functionArgs.unit);

        // Extend conversation with function response
        messages.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          content: functionResponse,
          // name: functionName,
        });
      }

      // Get a new response from the model where it can see the function response
      const secondResponse = await this.openaiService.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: messages,
      });

      // If you want to see the message directly, return message.content
      // return secondOpenAiResponse.choices[0].message.content;
      return secondResponse.choices[0];
    }
  }
}
