import {NextApiRequest, NextApiResponse} from 'next'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SECRET_KEY

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1]

        if(!token) {
            return res.status(403).json({ error: 'token is missing' })
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY)
            return res.status(200).json({ message: 'this is a protected route', user: decoded})
        } catch (error) {
            return res.status(403).json({ error: 'token is invalid' })
        }
    } else {
        res.setHeader('allow', ['POST'])
        res.status(405).end(`Method ${req.method} not allowed`)
    }
}