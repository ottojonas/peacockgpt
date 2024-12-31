import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Messages from "@/models/Messages";
import { v4 as uuidv4 } from "uuid";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const { key } = req.query;
  if (req.method === "GET") {
    try {
      const conversations = await Conversation.find({});
      res.status(200).json(conversations);
    } catch (error) {
      console.error("Error loading conversations:", error);
      res.status(500).json({ error: "Failed to load conversations" });
    }
  } else if (req.method === "POST") {
    try {
      const { title, desc, date, isSelected, isPinned } = req.body;
      const key = uuidv4();
      if (
        !key ||
        !title ||
        !desc ||
        !date ||
        isSelected === undefined ||
        isPinned === undefined
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newConversation = new Conversation({
        key,
        title,
        desc,
        date,
        isSelected,
        isPinned,
      });
      await newConversation.save();
      res
        .status(201)
        .json({ id: newConversation._id, key: newConversation.key });
    } catch (error) {
      console.error("Error saving conversation:", error);
      res.status(500).json({ error: "Failed to save conversation" });
    }
  } else if (req.method === "DELETE") {
    try {
      await Conversation.deleteMany({});
      await Messages.deleteMany({});

      res
        .status(200)
        .json({ message: "All conversations and messages deleted" });
    } catch (error) {
      console.error("Error deleting conversations and messages:", error);
      res
        .status(500)
        .json({ error: "Failed to delete conversations and messages" });
    }
  } else if (req.method === "PUT") {
    try {
      const { key } = req.query;
      const { isPinned, title, desc } = req.body;
      const updateData: any = {};
      if (isPinned !== undefined) updateData.isPinned = isPinned;
      if (title !== undefined) updateData.title = title;
      if (desc !== undefined) updateData.desc = desc;

      const updatedConversation = await Conversation.findOneAndUpdate(
        { key },
        updateData,
        { new: true }
      );
      res.status(200).json(updatedConversation);

      if (!updatedConversation) {
        return res.status(404).json({ error: "conversation not found" });
      }

      res.status(200).json(updatedConversation);
    } catch (error) {
      console.error("error updating conversation:", error);
      res.status(500).json({ error: "failed to update conversation" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
