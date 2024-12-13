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
        const { messages } = req.body;
        try {
            console.log('Received messages:', messages);
            fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
            res.status(200).json({ message: 'Messages saved successfully' });
        } catch (error) {
            console.error('Error saving messages:', error);
            res.status(500).json({ error: 'Failed to save messages' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}