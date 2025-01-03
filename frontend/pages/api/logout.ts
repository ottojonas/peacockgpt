import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/mongoose";
import User from "../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.decode(token) as { id: string };
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    jwt.verify(token, user.secretKey);
    res.setHeader("Set-Cookie", "token=; HttpOnly; Max-Age=0; Path=/");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
