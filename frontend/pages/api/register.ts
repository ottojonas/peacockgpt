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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userSecretKey = crypto.randomBytes(64).toString("hex");

    const newUser = new User({
      email,
      password: hashedPassword,
      secretKey: userSecretKey,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, userSecretKey, {
      expiresIn: "1h",
    });

    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=3600`
    );
    return res
      .status(201)
      .json({ message: "User registered successfully", token });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
