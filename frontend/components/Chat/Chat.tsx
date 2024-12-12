import React, { useState } from "react";
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

export default function Chat() {
  const [messages, setMessages] = useState<MessageItem[]>(data);

  const addMessage = (text: string) => {
    console.log("addMessage called with text:", text);
    const newMessage: MessageItem = {
      key: messages.length,
      text,
      isUser: true,
    };
    setMessages([...messages, newMessage]);
  };

  console.log("chat component rendered successfully");

  return (
    <div className="" style={{ marginLeft: "384px", marginRight: "320px" }}>
      <div className="max-w-3xl px-4 pt-16 pb-48 mx-auto">
        {messages.map((i: MessageItem) => (
          <ChatItem item={i} key={i.key} />
        ))}
      </div>
      {console.log("passing addMessage to ChatInput")}
      <ChatInput onSendMessage={addMessage} />
      {console.log("addMessage successfully passed to ChatInput")}
    </div>
  );
}
