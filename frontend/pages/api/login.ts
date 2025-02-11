import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/mongoose";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userSecretKey = crypto.randomBytes(64).toString("hex");

    user.secretKey = userSecretKey;
    await user.save();

    const token = jwt.sign({ id: user._id }, userSecretKey, {
      expiresIn: "1h",
    });

    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=3600`
    );
    return res
      .status(200)
      .json({ message: "User signed in successfully", token, userId: user._id });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
