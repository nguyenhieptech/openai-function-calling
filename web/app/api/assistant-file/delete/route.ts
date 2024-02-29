import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const assistantId = searchParams.get('assistant_id');
  const fileId = searchParams.get('file_id');

  if (!assistantId) {
    return Response.json({ error: 'No assistant id provided' }, { status: 400 });
  }

  if (!fileId) {
    return Response.json({ error: 'No file id provided' }, { status: 400 });
  }

  const openai = new OpenAI();

  // https://platform.openai.com/docs/api-reference/assistants/deleteAssistantFile
  try {
    const deletedFile = await openai.beta.assistants.files.del(assistantId, fileId);
    console.log(deletedFile);

    return Response.json(deletedFile);
  } catch (e) {
    console.log(e);
    return Response.json({ error: e });
  }
}
