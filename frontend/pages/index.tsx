import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import CustomHead from "@/components/common/CustomHead";
import ChatHistory from "@/components/ChatHistory";
import ChatHeader from "@/components/ChatHeader";
import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import Info from "@/components/Info";
import io from "socket.io-client";
import { MessageItem } from "../components/Chat/Chat";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../lib/sendMessage";
const socket = io("http://localhost:5000");

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [conversationKey, setConversationKey] = useState<string>("");

  useEffect(() => {
    if (conversationKey) {
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

      fetchMessages();

      socket.on("new_message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("new_message");
      };
    }
  }, [conversationKey]);

  const checkHealth = async () => {
    try {
      const response = await axios.get("/api/health");
      setHealthStatus(response.data.status);
    } catch (error) {
      setHealthStatus("error: unable to connect to backend");
    }
  };

  return (
    <>
      <CustomHead title="PeacockGPT" />
      <Sidebar />
      <ChatHistory
        setConversationKey={setConversationKey}
        setMessages={setMessages}
      />
      <ChatHeader />
      <Chat
        sendMessage={(text) => sendMessage(text, conversationKey, setMessages)}
        messages={messages}
        setMessages={setMessages}
        conversationKey={conversationKey}
      />
      <ChatInput
        sendMessage={(text) => sendMessage(text, conversationKey, setMessages)}
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        conversationKey={conversationKey}
      />
      <Info />
      <div className="fixed z-50 bottom-4 right-4"></div>
    </>
  );
}
