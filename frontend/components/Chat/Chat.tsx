import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import ChatInput from "../ChatInput/ChatInput";
import axios from "axios";
import { sendMessage as sendMsg } from "../../lib/sendMessage";
import { v4 as uuidv4 } from "uuid";
import { formatMessage } from "../../utils/formatMessage";

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
  rating: string;
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
    return () => {};
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

  const handleThumbsUp = async (key: string) => {
    try {
      await axios.post("/api/messages/rate", { key, rating: "good" });
      console.log("Message rated as good");
    } catch (error) {
      console.error("Error rating message:", error);
    }
  };

  const handleThumbsDown = async (key: string) => {
    try {
      await axios.post("/api/messages/rate", { key, rating: "bad" });
      console.log("Message rated as bad");
      // Regenerate response
      const response = await axios.post("/api/ask", {
        question: messages.find((msg) => msg.key === key)?.text,
      });
      const newMessage = response.data.answer;
      const formattedAnswer = formatMessage(newMessage);

      const newMessageItem: MessageItem = {
        key: uuidv4(),
        conversationKey,
        text: formattedAnswer,
        isUser: false,
        sender: "assistant",
        content: formattedAnswer,
        images: [],
        timestamp: new Date().toISOString(),
        date: new Date().toISOString(),
        rating: "good",
      };

      setMessages((prevMessages) => [...prevMessages, newMessageItem]);
    } catch (error) {
      console.error("Error regenerating response:", error);
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
            onThumbsUp={handleThumbsUp}
            onThumbsDown={handleThumbsDown}
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
