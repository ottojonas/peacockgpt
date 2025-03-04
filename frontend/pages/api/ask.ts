import "openai/shims/node";
import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/mongoose";
import TrainingDocument, {
  ITrainingDocument,
} from "../../models/TrainingDocument";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();

    if (req.method === "POST") {
      const { question } = req.body;

      if (!question) {
        return res.status(400).json({ error: "question is required" });
      }

      try {
        const documents: ITrainingDocument[] = await TrainingDocument.find({})
          .lean()
          .exec();

        const filteredDocuments = documents.map((doc) => ({
          key: doc.key,
          title: doc.title,
          content: doc.content,
        }));

        let documentTexts = filteredDocuments
          .map((doc) => doc.content)
          .join("\n\n");

        const maxLength = 1000000;
        if (documentTexts.length > maxLength) {
          documentTexts = documentTexts.substring(0, maxLength);
        }

        const prompt = `Here are some documents: \n\n${documentTexts}\n\nBased on the above documents, answer the following question:\n\nQuestion: ${question}\nAnswer:`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
        });

        const answer = response?.choices?.[0]?.message?.content?.trim();
        res.status(200).json({ answer });
      } catch (error) {
        if (error instanceof Error) {
          console.error("error generating response:", error.message);
          console.error("stack trace:", error.stack);
          res
            .status(500)
            .json({ message: "internal server error", error: error.message });
        } else {
          console.error("an unknown error occurred");
          res.status(500).json({ message: "internal server error" });
        }
      }
    } else {
      res.status(405).json({ message: "method not allowed" });
    }
  } catch (error) {
    console.error("error connecting to database or importing model:", error);
    res
      .status(500)
      .json({ message: "internal server error", error: String(error) });
  }
}
