import React, { useState } from "react";
import ChatItem from "./ChatItem";
import ChatInput from "@/components/ChatInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export type MessageItem = {
  key: string;
  conversationKey: string;
  isUser: boolean;
  sender: string;
  text: string;
  images: { key: number; url: string }[];
  timestamp: string;
  date: string;
  content: string;
};

interface ChatProps {
  sendMessage: (message: string) => void;
  messages: MessageItem[];
  setMessages: (messages: MessageItem[]) => void;
  conversationKey: string;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  setMessages,
  conversationKey,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const sendMessage = async (text: string) => {
    if (!text.trim()) {
      console.error("message content is empty");
      return;
    }
    try {
      const newMessage = {
        key: uuidv4(),
        text: text.trim(),
        isUser: true,
        images: [],
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        conversationKey: conversationKey,
        content: text,
        sender: "user",
      };

      await axios.post(`/api/messages`, {
        conversationKey,
        message: {
          text: newMessage.text,
          sender: "user",
          content: newMessage.text,
          date: newMessage.date,
        },
      });
      setMessages([...messages, newMessage]);
      setInputValue("");
    } catch (error) {
      console.error("error sending message:", error);
    }
  };
  return (
    <div
      className="chat-container"
      style={{ marginLeft: "384px", marginRight: "320px" }}
    >
      <div className="max-w-3xl px-4 pt-16 pb-48 mx-auto chat-messages">
        {messages.filter(Boolean).map((item) => (
          <ChatItem
            item={item}
            key={item.key}
            inputValue={inputValue}
            setInputValue={setInputValue}
            sendMessage={sendMessage}
          />
        ))}
      </div>
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        conversationKey={conversationKey}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
