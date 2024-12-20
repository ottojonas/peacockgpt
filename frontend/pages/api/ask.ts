import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongoose';
import { OpenAI } from 'openai';

// * initialise openai with the api key from environment variables 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// * define structure of training documents 
interface TrainingDocumentType {
  content: string;
}

// * main handler function for /api/ask end point 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // * connect to mongodb database 
  await connectToDatabase();

  // Dynamically import the TrainingDocument model
  const { default: TrainingDocument } = await import('@/models/TrainingDocument.mjs');

  // * handle POST request
  if (req.method === 'POST') {
    const { question } = req.body;

    // * validate request body 
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    try {
      // * load training documents
      const documents: TrainingDocumentType[] = await TrainingDocument.find({});
      let documentTexts = documents.map((doc: TrainingDocumentType) => doc.content).join('\n\n');

      // * truncate document texts if they exceed a certain length
      const maxLength = 1000000; 
      if (documentTexts.length > maxLength) {
        documentTexts = documentTexts.substring(0, maxLength);
      }

      // * log the document texts and prompt
      console.log("Document Texts:", documentTexts);

      // * create prompt
      const prompt = `Here are some documents: \n\n${documentTexts}\n\nBased on the above documents, answer the following question:\n\nQuestion: ${question}\nAnswer:`;

      console.log("Prompt:", prompt);

      // * generate response
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      });

      // * extract answer from response
      const answer = response?.choices?.[0]?.message?.content?.trim();
      res.status(200).json({ answer });
    } catch (error) {
      // * handle errors during response generation 
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
    // * handle unsupported request methods 
    res.status(405).json({ message: "method not allowed" });
  }
}