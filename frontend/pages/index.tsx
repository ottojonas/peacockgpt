import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import CustomHead from "@/components/common/CustomHead";
import ChatHistory from "@/components/ChatHistory";
import ChatHeader from "@/components/ChatHeader";
import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import Info from "@/components/Info";
import fs from "fs";
import path from "path";
import { MessageItem } from "@/components/Chat/Chat";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);

  useEffect(() => {
    axios.get("/api/loadMessages").then((response) => {
      setMessages(response.data);
    });

    socket.on("new_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

  const checkHealth = async () => {
    try {
      const response = await axios.get("/api/health");
      setHealthStatus(response.data.status);
    } catch (error) {
      setHealthStatus("error: unable to connect to backend");
    }
  };

  const sendMessage = (text: string) => {
    const newMessage = {
      key: messages.length + 1,
      text,
      isUser: true,
      images: [],
      date: new Date().toISOString(),
    };
    socket.emit("send_message", newMessage);
    setInputValue("");
  };

  return (
    <>
      <CustomHead title="PeacockGPT" />
      <Sidebar />
      <ChatHistory />
      <ChatHeader />
      <Chat
        sendMessage={sendMessage}
        messages={messages}
        setMessages={setMessages}
      />
      <ChatInput
        sendMessage={sendMessage}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      <Info />
      <div className="fixed z-50 bottom-4 right-4">
        <button
          className="px-4 py-2 text-black bg-white rounded"
          onClick={checkHealth}>
          backend connection check
        </button>
        {healthStatus && <p>{healthStatus}</p>}
      </div>
    </>
  );
}
