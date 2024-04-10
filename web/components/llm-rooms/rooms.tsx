'use client';

import type { AI } from '@/app/action';
import { Button } from '@/components/ui/button';
import { Room } from '@/lib/schemas/room.schema';
import { useActions, useUIState } from 'ai/rsc';

export function Rooms({ rooms }: { rooms: Room[] }) {
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  return (
    <div className="flex flex-wrap justify-stretch gap-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="basis-full space-y-3 border border-transparent shadow-sm hover:border-primary-foreground sm:max-w-[200px]"
        >
          <div className="overflow-hidden rounded-md">
            <img
              alt={`Image of ${room.name}`}
              loading="lazy"
              width="150"
              height="150"
              decoding="async"
              data-nimg="1"
              className="h-auto max-h-[150px] min-h-[150px] w-full object-cover transition-all hover:scale-105"
              src={room.image}
            />
          </div>
          <div className="flex flex-col justify-between space-y-1 text-sm">
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium leading-none">{room.name}</h3>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(room.price)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {room.description.slice(0, 150)}...
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant={'default'}
                onClick={async () => {
                  const response = await submitUserMessage(
                    `Purchasing ${room.name} with id ${room.id} [run \`show_purchase_ui\` function]`
                  );
                  setMessages((currentMessages) => [...currentMessages, response]);
                }}
              >
                Purchase
              </Button>
              <Button
                variant={'secondary'}
                onClick={async () => {
                  const response = await submitUserMessage(
                    `Show details for ${room.name}`
                  );
                  setMessages((currentMessages) => [...currentMessages, response]);
                }}
              >
                View
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
