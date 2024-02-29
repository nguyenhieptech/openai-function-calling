import OpenAI from 'openai';

export async function POST() {
  const openai = new OpenAI();

  // https://platform.openai.com/docs/api-reference/threads/createThread
  try {
    const thread = await openai.beta.threads.create();
    console.log(thread);

    return Response.json({ thread: thread });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e });
  }
}
