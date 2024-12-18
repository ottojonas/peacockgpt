import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongoose';
import TrainingDocument from '@/models/TrainingDocument';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TrainingDocumentType {
  content: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    try {
      // * load training documents
      const documents: TrainingDocumentType[] = await TrainingDocument.find({});
      let documentTexts = documents.map((doc: TrainingDocumentType) => doc.content).join('\n\n');

      // * truncate document texts if they exceed a certain length
      const maxLength = 10000; 
      if (documentTexts.length > maxLength) {
        documentTexts = documentTexts.substring(0, maxLength);
      }

      // * create prompt
      const prompt = `Here are some documents: \n\n${documentTexts}\n\nBased on the above documents, answer the following question:\n\nQuestion: ${question}\nAnswer:`;

      // * generate response
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
      });

      const answer = response?.choices?.[0]?.message?.content?.trim();
      res.status(200).json({ answer });
    } catch (error) {
      if (error instanceof Error) {
        console.error("error generating response:", error.message);
        console.error("stack trace:", error.stack);
        res.status(500).json({ message: "internal server error", error: error.message });
      } else {
        console.error("an unknown error occurred");
        res.status(500).json({ message: "internal server error" });
      }
    }
  } else {
    res.status(405).json({ message: "method not allowed" });
  }
}