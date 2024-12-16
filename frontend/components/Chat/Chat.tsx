import React, { useState, useEffect } from "react";
import ChatItem from "./ChatItem";
import ChatInput from "@/components/ChatInput";
import axios from "axios";
import data from "./data.json";

type Image = {
  key: number;
  url: string;
};

export interface MessageItem {
  key: number;
  isUser: boolean;
  text: string;
  images: { key: number; url: string }[];
  date: string;
}

interface ChatProps {
  sendMessage: (text: string) => void;
  messages: MessageItem[];
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  conversationKey: string;
}

//! written by millie
// const Chat = () => {
//   in English
// }

const Chat: React.FC<ChatProps> = ({
  sendMessage,
  messages,
  setMessages,
  conversationKey,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const saveMessagesToFile = async (messages: MessageItem[]) => {
    try {
      console.log("saving message to file:", messages);
      await axios.post(`/api/messages/${conversationKey}`, { messages });
    } catch (error) {
      console.error("error saving messages:", error);
    }
  };

  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      const newMessage: MessageItem = {
        key: messages.length + 1,
        text: text.trim(),
        isUser: true,
        images: [],
        date: new Date().toISOString(),
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
        {messages.filter(Boolean).map((item) => (
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
        messages={messages}
        conversationKey={conversationKey}
      />
    </div>
  );
};

export default Chat;
