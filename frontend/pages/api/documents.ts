import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // * placeholder code real quick :) 
        const documents = [
            { id: 1, title: 'Document 1'}, { id: 2, title: 'Document 2'},
        ]
        res.status(200).json({documents})
    } else {
        res.status(405).json({message: 'method not allowed'})
    }
}