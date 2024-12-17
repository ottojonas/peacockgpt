import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { MessageItem } from "../components/Chat/Chat";

export const sendMessage = async (
  text: string,
  conversationKey: string,
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>,
) => {
  if (!text.trim()) {
    console.error("message content is empty");
    return;
  }

  const newMessage: MessageItem = {
    key: uuidv4(),
    conversationKey,
    text: text.trim(),
    isUser: true,
    content: text,
    images: [],
    timestamp: new Date().toISOString(),
    sender: "user",
    date: new Date().toISOString(),
  };

  try {
    await axios.post("/api/messages", {
      conversationKey,
      message: {
        text: newMessage.text,
        sender: newMessage.sender,
        content: newMessage.text,
        date: newMessage.date,
      },
    });
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  } catch (error) {
    console.error("error sending message:", error);
  }
};
