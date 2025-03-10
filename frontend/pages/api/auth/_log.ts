import {NextApiRequest, NextApiResponse} from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const {message} = req.body; 
        console.log("Log Message: ", message); 
        res.status(200).json({message: "log rec" }); 
    } else {
        res.status(405).json({message: "Method not allowed"})
    }
}