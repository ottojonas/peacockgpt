import React, { useState } from "react";
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

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState("");

  const checkHealth = async () => {
    try {
      const response = await axios.get("/api/health");
      setHealthStatus(response.data.status);
    } catch (error) {
      setHealthStatus("error: unable to connect to backend");
    }
  };

  const sendMessage = (text: string) => {
    console.log("message send:", text);
  };

  return (
    <>
      <CustomHead title="PeacockGPT" />
      <Sidebar />
      <ChatHistory />
      <ChatHeader />
      <Chat sendMessage={sendMessage} />
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
