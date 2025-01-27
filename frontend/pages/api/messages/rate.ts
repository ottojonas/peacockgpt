import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/mongoose";
import Messages from "../../../models/Messages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { key, rating } = req.body;

    if (!key || !rating) {
      return res.status(400).json({ error: "key and rating are required" });
    }

    try {
      console.log("Recieved request body: ", req.body);
      console.log("Recieved key:", key);
      const message = await Messages.findOne({ key });
      if (!message) {
        console.log("Message not found for key:", key);
        return res.status(404).json({ error: "Message not found" });
      }

      message.rating = rating;
      await message.save();

      res.status(200).json({ message: "Message rated successfully" });
    } catch (error) {
      console.error("Error rating message:", error);
      res.status(500).json({ error: "Failed to rate message" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
