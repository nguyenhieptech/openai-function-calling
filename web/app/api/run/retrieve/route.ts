import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const threadId = searchParams.get('thread_id');
  const runId = searchParams.get('run_id');

  if (!threadId) {
    return Response.json({ error: 'No thread id provided' }, { status: 400 });
  }

  if (!runId) {
    return Response.json({ error: 'No run id provided' }, { status: 400 });
  }

  const openai = new OpenAI();

  // https://platform.openai.com/docs/api-reference/runs/getRun
  try {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    console.log(run);

    return Response.json({ run: run });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e });
  }
}
