import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const assistantId = searchParams.get('assistant_id');

  if (!assistantId) {
    return Response.json({ error: 'No id provided' }, { status: 400 });
  }

  const openai = new OpenAI();

  // https://platform.openai.com/docs/api-reference/assistants/deleteAssistant
  try {
    const response = await openai.beta.assistants.del(assistantId);
    console.log(response);

    return Response.json(response);
  } catch (e) {
    console.log(e);
    return Response.json({ error: e });
  }
}
