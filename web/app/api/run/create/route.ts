import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const threadId = searchParams.get('thread_id');
  const assistantId = searchParams.get('assistant_id');

  if (!threadId) {
    return Response.json({ error: 'No thread id provided' }, { status: 400 });
  }

  if (!assistantId) {
    return Response.json({ error: 'No  assistant id provided' }, { status: 400 });
  }

  const openai = new OpenAI();

  // https://platform.openai.com/docs/api-reference/runs/createRun
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    console.log({ run: run });

    return Response.json({ run: run });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e });
  }
}
