import React, { useState, useEffect } from "react";
import ChatItem from "./ChatItem";
import ChatInput from "@/components/ChatInput";
import axios from "axios";
import data from "./data.json";
import fs from "fs";
import path from "path";

export interface MessageItem {
  key: string;
  isUser: boolean;
  text: string;
  images: { key: number; url: string }[];
}
interface ChatProps {
  initialMessages?: MessageItem[];
  sendMessage: (text: string) => void;
}

const saveMessagesToFile = async (
  messages: MessageItem[],
  filename: string
) => {
  await axios.post("/api/saveMessages", { messages, filename });
};

//! written by millie
// const Chat = () => {
//   in English
// }
const Chat: React.FC<ChatProps> = ({ initialMessages = [], sendMessage }) => {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/loadMessages")
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
      });
  }, []);

  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      const newMessage: MessageItem = {
        key: Date.now().toString(),
        text: text.trim(),
        isUser: true,
        images: [],
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputValue("");
      saveMessagesToFile(updatedMessages, "conversation.json");
    }
  };

  return (
    <div className="" style={{ marginLeft: "384px", marginRight: "320px" }}>
      <div className="max-w-3xl px-4 pt-16 pb-48 mx-auto">
        {messages.map((item) => (
          <ChatItem
            item={item}
            key={item.key}
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
      />
    </div>
  );
};
