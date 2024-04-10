import { Checkout } from '@/components/llm-rooms/checkout';
import { CheckoutSkeleton } from '@/components/llm-rooms/checkout-skeleton';
import { BotCard, BotMessage } from '@/components/llm-rooms/messages';
import { Room } from '@/components/llm-rooms/room';
import { RoomSkeleton } from '@/components/llm-rooms/room-skeleton';
import { Rooms } from '@/components/llm-rooms/rooms';
import { spinner } from '@/components/llm-rooms/spinner';
import { UserRenting } from '@/components/llm-rooms/user-renting';
import { Purchase, purchaseSchema } from '@/lib/schemas/purchase.schema';
import { roomSchema } from '@/lib/schemas/room.schema';
import { runOpenAICompletion } from '@/lib/utils';
import { TSFixMe } from '@/types';
import { createAI, createStreamableUI, getMutableAIState } from 'ai/rsc';
import OpenAI from 'openai';
import 'server-only';
import { z } from 'zod';

const rooms = [
  {
    id: '1',
    name: 'Room 1',
    description: 'Room 1',
    type: 'luxury',
    available_for_renting: false,
    price: 10,
    image: 'https://source.unsplash.com/random/900×700/?room',
  },
  {
    id: '2',
    name: 'Room 2',
    description: 'Room 2',
    type: 'standard',
    available_for_renting: true,
    price: 20,
    image: 'https://source.unsplash.com/random/900×700/?hotel',
  },
  {
    id: '3',
    name: 'Room 3',
    description: 'Room 3',
    type: 'luxury',
    available_for_renting: false,
    price: 30,
    image: 'https://source.unsplash.com/random/900×700/?home',
  },
  {
    id: '4',
    name: 'Room 4',
    description: 'Room 4',
    type: 'work',
    available_for_renting: true,
    price: 40,
    image: 'https://source.unsplash.com/random/900×700/?meeting-room',
  },
  {
    id: '5',
    name: 'Room 5',
    description: 'Room 5',
    type: 'luxury',
    available_for_renting: true,
    price: 50,
    image: 'https://source.unsplash.com/random/900×700/?room-outdoors',
  },
  {
    id: '6',
    name: 'Room 6',
    description: 'Room 6',
    type: 'children',
    available_for_renting: false,
    price: 50,
    image: 'https://source.unsplash.com/random/900×700/?homestay,room',
  },
  {
    id: '7',
    name: 'Room 7',
    description: 'Room 7',
    type: 'luxury',
    available_for_renting: false,
    price: 50,
    image: 'https://source.unsplash.com/random/900×700/?room,luxury,sun',
  },
  {
    id: '8',
    name: 'Room 8',
    description: 'Room 8',
    type: 'children',
    available_for_renting: false,
    price: 50,
    image: 'https://source.unsplash.com/random/900×700/?hotel,room,children,blue',
  },
];

const openai = new OpenAI();

async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content,
    },
  ]);

  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>
  );

  const completion = runOpenAICompletion(openai, {
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `
          You are a friendly homestay assistant. You can help users with purchasing rooms, showing rooms,
          purchasing rooms, and other homestay-related tasks.
          You can also chat with users to request additional information or provide help.

          Messages inside [] means that it's a UI element or a user event. For example:
          - "[Showing room card - room with id 123]" means that the UI is showing a room card for a room with id 123.
          - "[Showing images of room with id 123]" means that the UI is showing images of a room with id 123.
          - "[Purchasing room with id 123]" means that the user is purchasing or renting a room with id 123.
          - "[User has successfully purchased room with id 123]" means that the user has successfully purchased a room with id 123.
          - "[User has failed to purchase room with id 123]" means that the user has failed to purchase a room with id 123.

          If you want to show list of rooms, call \`show_rooms\`.
          If user requests to buy a certain room, show purchase UI using \`show_purchase_ui\`. Always use the interface to show the purchase UI.
          Make sure to respond to every request with the \`show_purchase_ui\` function.
          NEVER say 'Let's proceed with the purchase' or similar. Always use the function.
          If user searches for a result that returns only one room, directly show room using \`show_room\`.
          Before that indicate that search returned only one room.
          If user wants to show their purchases, respond with a list of their purchases using \`show_users_purchases\`.
          If user wants to see list of rooms that are available for renting, call \`show_rooms\`. Filter list of rooms that are available for renting before returning the room list to user.

          Users don't need to know the id of room, you can use the name.

          Rooms: ${rooms.map((room) => Object.values(room).join(', ')).join('; ')}
          `,
      },
      ...aiState.get().map((info: TSFixMe) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    functions: [
      {
        name: 'show_rooms',
        description: `
          Show a list of rooms to the user.
          The user can then click on a room to view more details.
        `,
        parameters: z.object({
          rooms: roomSchema.array(),
        }),
      },
      {
        name: 'show_room',
        description: `
          Show a room to the user.
          The user can then click on a purchase button to purchase or rent the room.
        `,
        parameters: z.object({
          room: roomSchema,
        }),
      },
      {
        name: 'show_purchase_ui',
        description: `Show a purchase UI to the user.`,
        parameters: z.object({
          room: roomSchema,
        }),
      },
      {
        name: 'show_users_purchases',
        description: `Show a list of the user's purchases.`,
        parameters: z.object({
          purchases: purchaseSchema.array(),
        }),
      },
    ],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(<BotMessage>{content}</BotMessage>);
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: 'assistant', content }]);
    }
  });

  completion.onFunctionCall('show_rooms', async ({ rooms }) => {
    reply.update(<BotCard>Loading rooms...</BotCard>);

    reply.done(
      <BotCard>
        <Rooms rooms={rooms} />
      </BotCard>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'function',
        name: 'show_rooms',
        content: JSON.stringify(rooms),
      },
    ]);
  });

  completion.onFunctionCall('show_room', async ({ room }) => {
    reply.update(
      <BotCard>
        <RoomSkeleton />
      </BotCard>
    );

    reply.done(
      <BotCard>
        <Room room={room} />
      </BotCard>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'function',
        name: 'show_room',
        content: JSON.stringify(room),
      },
    ]);
  });

  completion.onFunctionCall('show_purchase_ui', async ({ room }) => {
    reply.update(
      <BotCard>
        <CheckoutSkeleton />
      </BotCard>
    );

    reply.done(
      <BotCard>
        <Checkout room={room} />
      </BotCard>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'function',
        name: 'show_purchase_ui',
        content: `[UI for purchasing ${room.name} with id ${room.id}]`,
      },
    ]);
  });

  completion.onFunctionCall(
    'show_users_purchases',
    async ({ purchases }: { purchases: Purchase[] }) => {
      reply.update(<BotCard>Preparing checkout...</BotCard>);

      reply.done(
        <BotCard>
          <UserRenting purchases={purchases} />
        </BotCard>
      );

      aiState.done([
        ...aiState.get(),
        {
          role: 'function',
          name: 'show_users_purchases',
          content: `[UI for showing purchases]`,
        },
      ]);
    }
  );

  return {
    id: Date.now(),
    display: reply.value,
  };
}

// Define necessary types and create the AI.

const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
