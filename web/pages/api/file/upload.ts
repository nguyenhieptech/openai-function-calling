import { IncomingForm } from 'formidable';
import { createReadStream } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Upload running');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the form data.' });
      return;
    }

    try {
      const fileArray = Array.isArray(files.file) ? files.file : [files.file];
      const file = fileArray[0];

      if (!file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
      }

      // Create a ReadStream from the file
      const fileStream = createReadStream(file.filepath);

      const openai = new OpenAI();
      // https://platform.openai.com/docs/api-reference/files/create
      const response = await openai.files.create({
        file: fileStream, // Use the ReadStream for uploading
        purpose: 'assistants',
      });

      res.status(200).json({ file: response });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : 'Unknown error' });
    }
  });
}
