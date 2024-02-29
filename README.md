# OpenAI Function Calling Integration Research

## Web

Install packages

```bash
cd web # Open terminal path in folder "web"

yarn
```

Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API

Install packages

```bash
cd api # Open terminal path in folder "api"

yarn
```

Add API Key in `.env`

```bash
OPENAI_API_KEY=Your OpenAI API Key
```

Run the development server

```bash
yarn start:dev
```

Open [http://localhost:3333/api/v1](http://localhost:3333/api/v1) with your browser to see the api health check or open [http://localhost:3333/swagger](http://localhost:3333/swagger)

Make request to endpoint http://localhost:3333/api/v1/openai/chat

Change the message in `chat.service.ts` line 22

```typescript
const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "user",
    content: "I mean what's the weather like in Paris (celsius)?",
  },
];
```
