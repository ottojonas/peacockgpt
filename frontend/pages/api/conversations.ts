import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/mongoose";
import Conversation from "../../models/Conversation";
import Messages from "../../models/Messages";
import { v4 as uuidv4 } from "uuid";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const { user_id, key } = req.query;
      if (key) {
        const conversation = await Conversation.findOne({ key });
        if (!conversation) {
          return res.status(400).json({ error: "conversation not found" });
        }
        return res.status(200).json(conversation);
      }
      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }
      const conversations = await Conversation.find({ user_id });
      return res.status(200).json(conversations);
    } catch (error) {
      console.error("Error loading conversations:", error);
      res.status(500).json({ error: "Failed to load conversations" });
    }
  }
  // * handle POST request
  else if (req.method === "POST") {
    try {
      const { title, desc, date, isSelected, isPinned, user_id } = req.body;
      const key = uuidv4();
      if (
        !key ||
        !title ||
        !desc ||
        !date ||
        !user_id ||
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
        user_id,
      });
      await newConversation.save();
      res
        .status(201)
        .json({ id: newConversation._id, key: newConversation.key });
    } catch (error) {
      // * handle erros during conversation saving
      console.error("Error saving conversation:", error);
      res.status(500).json({ error: "Failed to save conversation" });
    }
  }
  // * handle DELETE request
  else if (req.method === "DELETE") {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }
      await Conversation.deleteMany({ user_id });
      await Messages.deleteMany({ user_id });
      res
        .status(200)
        .json({ message: "User conversations and messages deleted" });
    } catch (error) {
      console.error("Error deleting conversations and messages:", error);
      res
        .status(500)
        .json({ error: "Failed to delete conversations and messages" });
    }
  } else if (req.method === "PUT") {
    try {
      const { key } = req.query;
      const { isPinned, title, desc, user_id } = req.body;
      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }
      const updateData: any = {};
      if (isPinned !== undefined) updateData.isPinned = isPinned;
      if (title !== undefined) updateData.title = title;
      if (desc !== undefined) updateData.desc = desc;

      const updatedConversation = await Conversation.findOneAndUpdate(
        { key },
        updateData,
        { new: true }
      );

      if (!updatedConversation) {
        return res.status(404).json({ error: "conversation not found" });
      }

      res.status(200).json(updatedConversation);
    } catch (error) {
      console.error("Error updating conversation:", error);
      res.status(500).json({ error: "Failed to update conversation" });
    }
  }
  // * handle unsupported requests
  else {
    // * set allowed methods in the response header
    res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
    // * response with a 405 fir unsupported methods
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
