import React, { useState, useEffect } from "react";
import ChatItem from "./ChatItem";
import ChatInput from "@/components/ChatInput";

export interface MessageItem {
  key: number;
  text: string;
  isUser: boolean;
  images: { key: number; url: string }[];
}
interface ChatProps {
  initialMessages?: MessageItem[];
  sendMessage: (text: string) => void;
}

const Chat: React.FC<ChatProps> = ({ initialMessages = [], sendMessage }) => {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>("");

  const handleSendMessage = (text: string) => {
    if (inputValue.trim()) {
      const newMessage: MessageItem = {
        key: Date.now(),
        text: inputValue.trim(),
        isUser: true,
        images: [],
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  useEffect(() => {
    console.log("chat component mounted");
    return () => {
      console.log("chat component unmounted");
    };
  }, []);

  useEffect(() => {
    console.log("sendMessage function updated:", handleSendMessage);
  }, [handleSendMessage]);

  return (
    <div className="" style={{ marginLeft: "384px", marginRight: "320px" }}>
      <div className="max-w-3xl px-4 pt-16 pb-48 mx-auto">
        {messages.map((item: MessageItem) => (
          <ChatItem item={item} key={item.key} />
        ))}
      </div>
      <ChatInput sendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
