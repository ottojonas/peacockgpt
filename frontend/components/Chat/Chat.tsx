import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import ChatInput from "@/components/ChatInput";
import axios from "axios";
import { sendMessage as sendMsg } from "@/lib/sendMessage";
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
  messages: MessageItem[];
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  conversationKey: string;
  sendMessage: (text: string) => void;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  setMessages,
  conversationKey,
  sendMessage,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    console.log("chat component mounted");
    return () => {
      console.log("chat component unmounted");
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/messages", {
          params: { conversationKey },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("error fetching messages:", error);
      }
    };
    if (conversationKey) {
      fetchMessages();
    }
  }, [conversationKey, setMessages]);

  return (
    <div
      className="chat-container"
      style={{ marginLeft: "384px", marginRight: "320px" }}>
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
        setMessages={setMessages}
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
