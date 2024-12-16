import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import connectToDatabase from '../../lib/mongoose';
import Conversation from '../../models/Conversation';
import Message from '../../models/Messages'

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
            const newConversation = new Conversation(req.body);
            await newConversation.save();
            res.status(201).json(newConversation);
        } catch (error) {
            console.error('error saving conversation:', error);
            res.status(500).json({ error: 'failed to save conversation' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`method ${req.method} not allowed`);
    }
}

