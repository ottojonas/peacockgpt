import {NextApiRequest, NextApiResponse} from 'next'
import connectToDatabase from '@/lib/mongoose'
const TrainingDocument = require('@/models/TrainingDocument')
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

interface TrainingDocumentType {
    title: string; 
    content: string; 
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase(); 

    if (req.method === 'POST'){
        const {question} = req.body

        if(!question) {
            return res.status(400).json({error: 'question is required'})
        }

        try {
            // * load training documents 
            const documents: TrainingDocumentType[] = await TrainingDocument.find({})
            const documentTexts = documents.map((doc: TrainingDocumentType) => doc.content).join('\n\n')

            // * create promt 
            const prompt = `here are some documents: \n\n${documentTexts}\n\nquestion: ${question}\nanswer:`

            // * generate response
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo', 
                messages: [{role: 'user', content:prompt }],
                max_tokens: 150, 
                n: 1, stop: null, temperature: 0.5,
            })

            const answer = response.choices?.[0]?.message?.content?.trim();

            return res.status(200).json({answer})
        } catch (error) {
            console.error('error generating response:', error)
            return res.status(500).json({ error: 'failed to generate response'})
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`method ${req.method} not allowed`)
    }
}