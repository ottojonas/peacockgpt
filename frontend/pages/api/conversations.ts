import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongoose';
import Conversation from '@/models/Conversation';
import Messages from '@/models/Messages';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const conversations = await Conversation.find({});
      res.status(200).json(conversations);
    } catch (error) {
      console.error('error loading conversations:', error);
      res.status(500).json({ error: 'failed to load conversations' });
    }
  } else if (req.method === 'POST') {
    try {
      const { key, title, desc, date, isSelected, isPinned } = req.body;
      if (!key || !title || !desc || !date || isSelected === undefined || isPinned === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newConversation = new Conversation({ key, title, desc, date, isSelected, isPinned });
      await newConversation.save();
      res.status(201).json({ id: newConversation._id });
    } catch (error) {
      console.error("Error saving conversation:", error);
      res.status(500).json({ error: "Failed to save conversation" });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Conversation.deleteMany({});
      await Messages.deleteMany({});
      res.status(200).json({ message: 'All conversations and messages deleted' });
    } catch (error) {
      console.error('Error deleting conversations and messages:', error);
      res.status(500).json({ error: 'Failed to delete conversations and messages' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}