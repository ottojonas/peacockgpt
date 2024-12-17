import React, { useState } from "react";
import ChatItem from "./ChatItem";
import ChatInput from "@/components/ChatInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
type Image = {
  key: number;
  url: string;
};

export type MessageItem = {
  key: string;
  conversationKey: string;
  isUser: boolean;
  text: string;
  images: { key: number; url: string }[];
  timestamp: string;
  date: string;
};

interface ChatProps {
  sendMessage: (message: string) => void;
  messages: MessageItem[];
  setMessages: (messages: MessageItem[]) => void;
  conversationKey: string;
}

const Chat: React.FC<ChatProps> = ({
  sendMessage,
  messages,
  setMessages,
  conversationKey,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) {
      console.error("message content is empty");
      return;
    }
    try {
      const response = await axios.post("/api/messages", {
        conversationKey,
        content: message,
      });

      const newMessageItem: MessageItem = {
        key: uuidv4(),
        conversationKey,
        text: message,
        isUser: true,
        images: [],
        timestamp: new Date().toISOString(),
        date: new Date().toISOString(),
      };
      setMessages([...messages, newMessageItem]);
      setInputValue("");
    } catch (error) {
      console.error("error sending message:", error);
    }
  };

  return (
    <div
      className="chat-container"
      style={{ marginLeft: "384px", marginRight: "320px" }}>
      <div className="max-w-3xl px-4 pt-16 pb-48 mx-auto chat-messages">
        {messages.filter(Boolean).map((item) => (
          <ChatItem
            item={item}
            key={item.conversationKey}
            sendMessage={handleSendMessage}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        ))}
      </div>
      <ChatInput
        sendMessage={handleSendMessage}
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        conversationKey={conversationKey}
      />
    </div>
  );
};

export default Chat;
