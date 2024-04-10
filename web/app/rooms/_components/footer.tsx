'use client';

import { AI } from '@/app/action';
import { cn } from '@/lib/utils';
import { useActions, useUIState } from 'ai/rsc';
import React from 'react';

const commands = ['Show rooms', 'Show my renting'];

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  async function handleCommand(command: string) {
    const response = await submitUserMessage(command);
    setMessages((currentMessages) => [...currentMessages, response]);
  }

  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      Suggested commands:{' '}
      {commands.map((command, i) => (
        <span
          key={command}
          className="padding-4 cursor-pointer text-blue-500 hover:underline"
          onClick={() => handleCommand(command)}
        >
          {i === 0 ? '' : ', '}
          {command}
        </span>
      ))}
    </p>
  );
}
