import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/mongoose";
import User from "../../models/User";
import argon2 from "argon2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "email and password are required" });
    }
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Could not find user" });
    }

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "password reset successful" });
  } else {
    res.setHeader("allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
