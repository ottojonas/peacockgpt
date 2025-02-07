import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    "__vercel_live_token=your_token_value; SameSite=None; Secure; Path=/"
  );
  res.status(200).json({ message: "Cookie set" });
}
