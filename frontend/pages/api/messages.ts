import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongoose';
import Messages from '../../models/Messages';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { conversationKey } = req.query;
    if (!conversationKey) {
      return res.status(400).json({ error: 'conversationKey is required' });
    }
    try {
      const messages = await Messages.find({ conversationKey });
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      res.status(500).json({ error: 'Failed to load messages' });
    }
  } else if (req.method === 'POST') {
    const { conversationKey, message } = req.body;
    if (!conversationKey || !message) {
      return res.status(400).json({ error: 'conversationKey and message are required' });
    }

    try {
      const newMessage = new Messages({ conversationKey, message });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Failed to save message' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}