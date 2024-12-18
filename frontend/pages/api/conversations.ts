import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongoose';
import Conversation from '@/models/Conversation';
import Messages from '@/models/Messages';

// * main handler function for /api/conversations endpoint 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // * connect to mongodb database
  await connectToDatabase();

  // * handle GET requests
  if (req.method === 'GET') {
    try {
      // * fetch all conversations from database
      const conversations = await Conversation.find({});
      // * respond with fetched conversations 
      res.status(200).json(conversations);
    } catch (error) {
      // * handle errors during conversation fetching 
      console.error('error loading conversations:', error);
      res.status(500).json({ error: 'failed to load conversations' });
    }
  } 
  // * handle POST request
  else if (req.method === 'POST') {
    try {
      // * destructure the required fields from the request body 
      const { key, title, desc, date, isSelected, isPinned } = req.body;
      // * validate request body 
      if (!key || !title || !desc || !date || isSelected === undefined || isPinned === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // * create new conversation object 
      const newConversation = new Conversation({ key, title, desc, date, isSelected, isPinned });
      // * save new conversation to database 
      await newConversation.save();
      // * response with id of newly created conversation
      res.status(201).json({ id: newConversation._id });
    } catch (error) {
      // * handle erros during conversation saving 
      console.error("Error saving conversation:", error);
      res.status(500).json({ error: "Failed to save conversation" });
    }
  } 
  // * handle DELETE request
  else if (req.method === 'DELETE') {
    try {
      // * delete all conversations and messages from database 
      await Conversation.deleteMany({});
      await Messages.deleteMany({});
      // * response with a success message 
      res.status(200).json({ message: 'All conversations and messages deleted' });
    } catch (error) {
      // * handle errors during deletion 
      console.error('Error deleting conversations and messages:', error);
      res.status(500).json({ error: 'Failed to delete conversations and messages' });
    }
  } 
  // * handle unsupported requests 
  else {
    // * set allowed methods in the response header 
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    // * response with a 405 fir unsupported methods 
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}