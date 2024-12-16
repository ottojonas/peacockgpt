import React, { useState } from "react";
import ChatItem from "./ChatItem";
import ChatInput from "@/components/ChatInput";
import axios from "axios";

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
  sendMessage: (message: string) => void;
  messages: MessageItem[];
  setMessages: (messages: MessageItem[]) => void;
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
  const [selectedConversation, setSelectedConversation] = useState<{
    key: string;
  } | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendMessage = async (message: string) => {
    if (!selectedConversation) {
      console.error("no conversation selected");
      return;
    }

    if (!newMessage.trim()) {
      console.error("message content in empty");
      return;
    }
    try {
      const response = await axios.post("/api/messages", {
        conversationKey: selectedConversation.key,
        content: message,
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("error sending message:", error);
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
