import React, { useState, useEffect } from "react";
import ChatItem from "./ChatItem";
import ChatInput from "@/components/ChatInput";

export type MessageItem =
  | {
      key: number;
      text: string;
      isUser: boolean;
      images?: undefined;
    }
  | {
      key: number;
      text: string;
      isUser: boolean;
      images: {
        key: number;
        url: string;
      }[];
    };

const data: MessageItem[] = [];

const Chat = () => {
  const [messages, setMessages] = useState<MessageItem[]>(data);

  const sendMessage = (text: string) => {
    const newMessage: MessageItem = {
      key: messages.length,
      text,
      isUser: true,
    };
    setMessages([...messages, newMessage]);
  };

  useEffect(() => {
    console.log("chat component mounted");
    return () => {
      console.log("chat component unmounted");
    };
  }, []);

  useEffect(() => {
    console.log("sendMessage function updated:", sendMessage);
  }, [sendMessage]);

  return (
    <div className="" style={{ marginLeft: "384px", marginRight: "320px" }}>
      <div className="max-w-3xl px-4 pt-16 pb-48 mx-auto">
        {messages.map((item: MessageItem) => (
          <ChatItem item={item} key={item.key} />
        ))}
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
