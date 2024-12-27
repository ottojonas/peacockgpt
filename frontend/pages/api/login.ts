import {NextApiRequest, NextApiResponse} from 'next'
import connectToDatabase from '@/lib/mongoose'
import User from '@/models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SECRET_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST') {
        const {email, password} = req.body; 

        if (!email || !password ) {
            return res.status(400).json({error: 'email and password are required'})
        }
        await connectToDatabase(); 

        const user = await User.findOne({email})
        if (!User || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'invalid email or password'})
        }

        const token = jwt.sign({ userId: user._id}, SECRET_KEY, {expiresIn: '1h'})

        return res.status(200).json({ token })
    } else {
        res.setHeader('allow', ['POST'])
        res.status(405).end(`Method ${req.method} not allowed`)
    }
}