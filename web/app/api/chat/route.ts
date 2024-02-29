import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');

  // Example dummy function hard coded to return the same weather
  // In production, this could be your backend API or an external API
  function getCurrentWeather(location: string, unit = 'fahrenheit') {
    if (location.toLowerCase().includes('tokyo')) {
      return JSON.stringify({ location: 'Tokyo', temperature: '15', unit: 'celsius' });
    } else if (location.toLowerCase().includes('san francisco')) {
      return JSON.stringify({
        location: 'San Francisco',
        temperature: '72',
        unit: 'fahrenheit',
      });
    } else if (location.toLowerCase().includes('paris')) {
      return JSON.stringify({ location: 'Paris', temperature: '22', unit: 'fahrenheit' });
    } else {
      return JSON.stringify({ location, temperature: 'unknown' });
    }
  }

  const openai = new OpenAI();

  // Step 1: send the conversation and available functions to the model
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: "What's the weather like in San Francisco in celsius?",
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

  const openAiResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: messages,
    tools: tools,
  });

  const responseMessage = openAiResponse.choices[0].message;

  // Step 2: check if the model wanted to call a function
  const toolCalls = responseMessage.tool_calls!;

  if (responseMessage.tool_calls) {
    // Note: the JSON response may not always be valid; be sure to handle errors
    const availableFunctions: Record<string, Function> = {
      get_current_weather: getCurrentWeather,
    };
    messages.push(responseMessage); // extend conversation with assistant's reply

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      const functionResponse = functionToCall(functionArgs.location, functionArgs.unit);

      messages.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        content: functionResponse,
      });
    }

    const secondOpenAiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: messages,
    });

    // return Response.json(secondOpenAiResponse.choices[0]);
    return Response.json(secondOpenAiResponse.choices[0].message.content);
  }
}
