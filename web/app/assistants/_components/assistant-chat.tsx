'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { API_URL, http } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Message } from 'ai';
import { useChat } from 'ai/react';
import { SendHorizontalIcon } from 'lucide-react';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { CopyToClipboard } from './copy-to-clipboard';

// const formSchema = z.object({
//   input: z.string().min(2, {
//     message: 'User input must be at least 2 characters.',
//   }),
// });

export function AssistantChat() {
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     input: '',
  //   },
  // });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   setInput(values.input);
  //   handleSubmit();
  // }

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleSubmit, handleInputChange, isLoading } = useChat({
    api: `${API_URL}/chat-completions`,
    initialMessages: [
      {
        id: Date.now().toString(),
        role: 'system',
        content: 'You are an assistant that gives really long answers.',
      },
    ],
  });

  useEffect(() => {
    if (scrollAreaRef.current === null) return;
    scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
  }, [messages]);

  return (
    <section className="container flex h-full w-full flex-auto">
      <div className="flex h-full w-full flex-col max-xl:w-[44rem]">
        <h2 className="text-center text-2xl font-semibold">AI Chatbot</h2>

        {/* Chat area */}
        <div className="flex h-full flex-col items-center justify-between pb-4">
          <ScrollArea className="h-[32rem] w-full sm:w-[80%]" ref={scrollAreaRef}>
            {messages.map((m) => (
              <div key={m.id} className="mr-6 whitespace-pre-wrap md:mr-12">
                {m.role === 'user' && (
                  <div className="mb-6 flex gap-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="text-sm">U</AvatarFallback>
                    </Avatar>
                    <div className="mt-1.5">
                      <p className="font-semibold">You</p>
                      <div className="mt-1.5 text-sm leading-6 text-zinc-500">
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}

                {m.role === 'assistant' && (
                  <div className="mb-6 flex gap-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-emerald-500 text-white">
                        Bot
                      </AvatarFallback>
                    </Avatar>
                    <div className="mt-1.5 w-full">
                      <div className="flex justify-between">
                        <p className="font-semibold">Chatbot</p>
                        <Tooltip>
                          <TooltipTrigger>
                            <CopyToClipboard
                              contentToCopy={m.content}
                              className="-mt-1"
                            />
                          </TooltipTrigger>
                          <TooltipContent>Click to copy</TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="mt-2 text-sm leading-6 text-zinc-500">
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>

          {/* <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative w-[80%] pb-4"
            > */}
          <form onSubmit={handleSubmit} className="relative w-[80%] pb-4">
            {/* <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="h-16" placeholder="User typing..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            <Input
              className="h-16"
              placeholder="User typing..."
              name="message"
              value={input}
              onChange={handleInputChange}
            />
            <Button
              className="absolute right-3 top-3"
              size="icon"
              type="submit"
              disabled={isLoading}
            >
              <SendHorizontalIcon className="h-5 w-5 text-primary-foreground" />
            </Button>
          </form>
          {/* </Form> */}
        </div>
      </div>
    </section>
  );
}
