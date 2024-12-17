import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongoose';
import Messages from '@/models/Messages';
import Conversation from '@/models/Conversation';
import { v4 as uuidv4 } from 'uuid';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { conversationKey } = req.query;
    console.log('GET request received with conversationKey:', conversationKey);
    if (!conversationKey) {
      console.error('missing conversationKey')
      return res.status(400).json({ error: 'conversationKey is required' });
    }
    try {
      const messages = await Messages.find({ conversationKey });
      res.status(200).json(messages);
    } catch (error) {
        if (error instanceof Error) {
          console.error('error loading messages:', error.stack);
        } else {
          console.error('error loading messages:', error);
        }
      res.status(500).json({ error: 'failed to load messages' });
    }
  } else if (req.method === 'POST') {
    const { conversationKey, message } = req.body;
    console.log('POST request received with conversationKey:', conversationKey, 'and message:', message);
    if (!conversationKey) {
      console.error('Missing conversationKey');
      return res.status(400).json({ error: 'conversationKey is required' });
    }
    if (!message) {
      console.error('Missing message');
      return res.status(400).json({ error: 'message is required' });
    }
    if (!message.sender) {
      console.error('Missing message sender');
      return res.status(400).json({ error: 'message sender is required' });
    }
    if (!message.content) {
      console.error('Missing message content');
      return res.status(400).json({ error: 'message content is required' });
    }

    try {
      const conversation = await Conversation.findOne({ key: conversationKey });
      if (!conversation) {
        console.error('conversation not found')
        return res.status(404).json({ error: 'Conversation not found' });
      }

      const newMessage = new Messages({
        key: uuidv4(),
        conversationKey, 
        text: message.text, 
        sender: message.sender,
        content: message.content,
        timestamp: message.date,
      });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('error saving message:', error);
      res.status(500).json({ error: 'failed to save message' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}