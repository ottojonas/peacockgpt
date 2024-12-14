import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json');

  if (req.method === 'GET') {
    try {
      const fileContents = fs.readFileSync(messagesFilePath, 'utf-8');
      const messages = fileContents ? JSON.parse(fileContents) : [];
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      res.status(500).json({ error: 'Failed to load messages' });
    }
  } else if (req.method === 'POST') {
    const { newMessage } = req.body;
    if (!newMessage || typeof newMessage !== 'object') {
      res.status(400).json({ error: 'Invalid message format' });
      return;
    }
    try {
      const fileContents = fs.readFileSync(messagesFilePath, 'utf-8');
      const existingMessages = fileContents ? JSON.parse(fileContents) : [];
      const updatedMessages = [...existingMessages, newMessage];
      fs.writeFileSync(messagesFilePath, JSON.stringify(updatedMessages, null, 2));
      res.status(200).json({ message: 'Message saved successfully' });
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Failed to save message' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}