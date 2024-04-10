'use client';

import type { AI } from '@/app/action';
import { Button } from '@/components/ui/button';
import { type Room } from '@/lib/schemas/room.schema';
import { useActions, useUIState } from 'ai/rsc';

export function Room({ room }: { room: Room }) {
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  return (
    <>
      <div
        key={room?.id}
        className="flex max-w-full flex-row gap-4 space-y-3 border border-transparent shadow-sm hover:border-primary-foreground"
      >
        <div className="w-fit overflow-hidden rounded-md">
          <img
            alt={`Image of ${room?.name}`}
            loading="lazy"
            width="150"
            height="150"
            decoding="async"
            data-nimg="1"
            className="aspect-square h-auto w-auto max-w-[100px] object-cover transition-all hover:scale-105"
            src={room?.image}
          />
        </div>
        <div className="flex w-full flex-col justify-between space-y-1 text-sm">
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xl font-medium leading-none">{room?.name}</h3>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(room?.price)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{room?.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Button
          onClick={async () => {
            const response = await submitUserMessage(
              `Purchasing ${room?.name} with id ${room?.id}`
            );
            setMessages((currentMessages) => [...currentMessages, response]);
          }}
        >
          Purchase
        </Button>
      </div>
    </>
  );
}
