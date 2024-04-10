import { TSFixMe } from '@/types';
import { OpenAIStream } from 'ai';
import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import type OpenAI from 'openai';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = 'http://localhost:3333/api/v1';

/**
 * `baseURL: 'http://localhost:3333/api/v1/'`
 */
export const http = axios.create({ baseURL: `${API_URL}/` });

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//* OpenAI

/**
 * A tool definition contains all information required for a language model to generate tool calls.
 */
export interface ToolDefinition<NAME extends string, PARAMETERS> {
  /**
   * The name of the tool.
   * Should be understandable for language models and unique among the tools that they know.
   *
   * Note: Using generics to enable result type inference when there are multiple tool calls.
   */
  name: NAME;

  /**
   * A optional description of what the tool does. Will be used by the language model to decide whether to use the tool.
   */
  description?: string;

  /**
   * The schema of the input that the tool expects. The language model will use this to generate the input.
   * Use descriptions to make the input understandable for the language model.
   */
  parameters: z.Schema<PARAMETERS>;
}

async function consumeStream(stream: ReadableStream) {
  const reader = stream.getReader();
  while (true) {
    const { done } = await reader.read();
    if (done) break;
  }
}

export function runOpenAICompletion<
  T extends Omit<
    Parameters<typeof OpenAI.prototype.chat.completions.create>[0],
    'functions'
  > & {
    functions: ToolDefinition<TSFixMe, TSFixMe>[];
  },
>(openai: OpenAI, params: T) {
  let text = '';
  let hasFunction = false;

  type FunctionNames =
    T['functions'] extends Array<TSFixMe> ? T['functions'][number]['name'] : never;

  let onTextContent: (text: string, isFinal: boolean) => void = () => {};

  let onFunctionCall: Record<string, (args: Record<string, TSFixMe>) => void> = {};

  const { functions, ...rest } = params;

  (async () => {
    consumeStream(
      OpenAIStream(
        (await openai.chat.completions.create({
          ...rest,
          stream: true,
          functions: functions.map((fn) => ({
            name: fn.name,
            description: fn.description,
            parameters: zodToJsonSchema(fn.parameters) as Record<string, unknown>,
          })),
        })) as TSFixMe,
        {
          async experimental_onFunctionCall(functionCallPayload) {
            hasFunction = true;
            onFunctionCall[functionCallPayload.name as keyof typeof onFunctionCall]?.(
              functionCallPayload.arguments as Record<string, TSFixMe>
            );
          },
          onToken(token) {
            text += token;
            if (text.startsWith('{')) return;
            onTextContent(text, false);
          },
          onFinal() {
            if (hasFunction) return;
            onTextContent(text, true);
          },
        }
      )
    );
  })();

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>
    ) => {
      onTextContent = callback;
    },
    onFunctionCall: (
      name: FunctionNames,
      callback: (args: TSFixMe) => void | Promise<void>
    ) => {
      onFunctionCall[name] = callback;
    },
  };
}
