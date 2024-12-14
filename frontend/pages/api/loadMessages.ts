import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from 'path';

const conversationsDir = path.join(process.cwd(), 'data', 'conversations')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json');

  if (req.method === 'GET') {
    try {
      const files = fs.readdirSync(conversationsDir); 
      const conversations = files.map((file) => {
        const filePath = path.join(conversationsDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(content)
      })
      res.status(200).json(conversations)
    } catch (error) {
      console.error('error loading conversations:', error)
      res.status(500).json({ error: 'failed to load conversations'})
    }
  } else if (req.method === 'POST') {
    const { newConversation } = req.body; 
    if (!newConversation || typeof newConversation !== 'object'){
      res.status(400).json({ error: 'invaild conversation format' })
      return 
    }
    try {
      const filePath = path.join(conversationsDir, `${newConversation.key}.json`)
      fs.writeFileSync(filePath, JSON.stringify(newConversation, null, 2))
      res.status(200).json({ message: 'conversation saved successfully'})
    } catch (error) {
      console.error('error saving conversation:', error)
      res.status(500).json({ error: 'failed to save conversation' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} not allowed`)
  }
}