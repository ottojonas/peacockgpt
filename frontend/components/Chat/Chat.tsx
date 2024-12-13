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

//! written by millie
// const Chat = () => {
//   in English
// }

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    axios
      .get("/api/loadMessages")
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
      });
  }, []);

  const saveMessagesToFile = async (messages: MessageItem[]) => {
    try {
      console.log("saving message to file:", messages);
      await axios.post("/api/loadMessages", { messages });
    } catch (error) {
      console.error("error saving messages:", error);
    }
  };

  const handleSendMessage = (text: string) => {
    console.log("handleSendMessage called with text:", text);
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
      saveMessagesToFile(updatedMessages);
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

export default Chat;
