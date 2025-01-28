import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/mongoose";
import BadResponse from "../../models/BadResponse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method === "POST") {
    const {
      key,
      conversationKey,
      text,
      isUser,
      content,
      images,
      timestamp,
      sender,
      date,
      rating,
    } = req.body;
    if (
      !key ||
      !conversationKey ||
      !text ||
      !content ||
      !timestamp ||
      !sender ||
      !date ||
      !rating
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const newBadResponse = new BadResponse({
        key,
        conversationKey,
        text,
        isUser,
        content,
        images,
        timestamp,
        sender,
        date,
        rating,
      });
      await newBadResponse.save();
      res.status(201).json(newBadResponse);
    } catch (error) {
      console.error("Error saving bad response: ", error);
      res.status(500).json({ error: "Failed to save bad response" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
