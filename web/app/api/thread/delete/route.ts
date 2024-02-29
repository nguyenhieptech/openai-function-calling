import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const threadId = searchParams.get('thread_id');

  if (!threadId) {
    return Response.json({ error: 'No id provided' }, { status: 400 });
  }

  const openai = new OpenAI();

  // https://platform.openai.com/docs/api-reference/threads/deleteThread
  try {
    const thread = await openai.beta.threads.del(threadId);
    console.log(thread);

    return Response.json({ thread: thread });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e });
  }
}
