import React, { useState } from "react";
import ChatItem from "./ChatItem";
import ChatInput from "@/components/ChatInput";
import axios from "axios";
import { sendMessage as sendMsg } from "@/lib/sendMessage";
import { v4 as uuidv4 } from "uuid";

// * define structure of message item
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

// * define props for chat component
interface ChatProps {
  messages: MessageItem[];
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  conversationKey: string;
  sendMessage: (text: string) => void;
}

// * chat component to display chat interface
const Chat: React.FC<ChatProps> = ({
  messages,
  setMessages,
  conversationKey,
  sendMessage,
}) => {
  // * state to manage input value
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <div
      className="chat-container"
      style={{ marginLeft: "384px", marginRight: "320px" }}>
      <div className="max-w-3xl px-4 pt-16 pb-48 mx-auto chat-messages">
        {/* Render each chat item */}
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
      {/* Chat input component */}
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
