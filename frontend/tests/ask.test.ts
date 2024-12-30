import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../pages/api/ask';
import axios from 'axios';

jest.mock('axios');

describe('ask API', () => {
    it('should return a mocked API response', async () => {
        (axios.post as jest.Mock).mockResolvedValue({
            data: { answer: "The weather is sunny with a high of 25°C." },
        });

        const req = {
            method: 'POST',
            body: { question: 'what is the weather like today?' },
            query: {},
            cookies: {},
            env: {},
            headers: {},
            url: '',
            socket: {} as any,
            aborted: false,
            complete: false,
            httpVersion: '',
            httpVersionMajor: 0,
            httpVersionMinor: 0,
            trailers: {},
            rawHeaders: [],
            rawTrailers: [],
            setTimeout: jest.fn(),
        } as Partial<NextApiRequest> as NextApiRequest;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as Partial<NextApiResponse> as NextApiResponse;

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            answer: "The weather is sunny with a high of 25°C.",
        });
    });
});