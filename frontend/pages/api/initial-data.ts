import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/mongoose";
import User from "../../models/User";
import Conversation from "../../models/Conversation";
import Message from "../../models/Messages";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  await connectToDatabase();

  try {
    const user = await User.findById(session.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const conversations = await Conversation.find({ userId: user.id });
    const messages = await Message.find({ userId: user.id });

    res.status(200).json({
      user: { id: user.id, email: user.email },
      conversations,
      messages,
    });
  } catch (error) {
    console.error("Error fetching initial data: ", error);
    res.status(500).json({ error: "Failed to fetch initial data" });
  }
}
