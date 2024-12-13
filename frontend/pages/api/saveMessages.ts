import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { messages, filename } = req.body; 
        const filePath = path.join(process.cwd(), filename)
        fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf-8'); 
        res.status(200).json({ message: 'message saved successfully' })
    } else {
        res.status(405).json({ message: 'method not allowed'})
    }
}