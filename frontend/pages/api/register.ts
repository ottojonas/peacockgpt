import {NextApiResponse, NextApiRequest} from 'next'
import connectToDatabase from '@/lib/mongoose'
import User from '@/models/User'
import bcrypt from 'bcrypt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required'})
        }
        await connectToDatabase(); 

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'email already registered'})
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUser = new User({ email, password: hashedPassword})
        await newUser.save(); 

        // ? return res.status(200).json({ message: 'user registered successfully'})
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} not allowed`)
    }
}