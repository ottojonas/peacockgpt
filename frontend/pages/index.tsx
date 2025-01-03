import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import CustomHead from "../components/common/CustomHead";
import ChatHistory from "../components/ChatHistory";
import ChatHeader from "../components/ChatHeader";
import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";
import Info from "../components/Info";
import io from "socket.io-client";
import { MessageItem } from "../components/Chat/Chat";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../lib/sendMessage";

// * initialise socket connection
const socket = io("http://localhost:5000");

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [conversationKey, setConversationKey] = useState<string>("");
  const [conversations, setConversations] = useState<any[]>([]);

  // * effect to fetch messages when the conversation key changes
  useEffect(() => {
    if (conversationKey) {
      console.log("fetching messages for:", conversationKey);
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
    }
  }, [conversationKey]);

  return (
    <>
      {/* custom head component for setting meta tags */}
      <CustomHead title="PeacockGPT" />
      {/* sidebar component for navigation */}
      <Sidebar />
      {/* chat history component to display list of conversations */}
      <ChatHistory
        setConversationKey={setConversationKey}
        setMessages={setMessages}
      />
      {/* chat header component */}
      <ChatHeader />
      {/* chat component to display chat messages */}
      <Chat
        sendMessage={(text) =>
          sendMessage(text, conversationKey, setMessages, setConversations)
        }
        messages={messages}
        setMessages={setMessages}
        conversationKey={conversationKey}
      />
      {/* chat input component for user input */}
      <ChatInput
        setMessages={setMessages}
        sendMessage={(text) =>
          sendMessage(text, conversationKey, setMessages, setConversations)
        }
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        conversationKey={conversationKey}
      />
      {/* info component to display additional information */}
      <Info />
      <div className="fixed z-50 bottom-4 right-4">
        {/*
        <button
          className="px-4 py-2 text-black bg-white rounded"
          onClick={checkHealth}>
          backend connection check
        </button>
        */}
      </div>
    </>
  );
}
