import React, { useState, useEffect } from "react";
import { MessageItem } from "../components/Chat/Chat";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../lib/sendMessage";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContenxt";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import CustomHead from "../components/common/CustomHead";
import ChatHistory from "../components/ChatHistory";
import ChatHeader from "../components/ChatHeader";
import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";
import Info from "../components/Info";
import io from "socket.io-client";

// * initialise socket connection
const socket = io("http://localhost:5000");

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [conversationKey, setConversationKey] = useState<string>("");
  const [conversations, setConversations] = useState<any[]>([]);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchInitialData = async () => {
        try {
          const response = await axios.get("/api/initial-data", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log("initial data: ", response.data);
        } catch (error) {
          console.error("error fetching initial data: ", error);
        }
      };
      fetchInitialData();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return null;
  }

  // * effect to fetch messages when the conversation key changes
  useEffect(() => {
    if (conversationKey) {
      // console.log("fetching messages for:", conversationKey);
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

  const handleDeleteConversation = (key: string) => {
    setConversations((prevConversations) =>
      prevConversations.filter((conversation) => conversation.key !== key)
    );
    setMessages([]);
    setConversationKey("");
  };

  return (
    <>
      <CustomHead title="PeacockGPT" />
      <Sidebar />
      <ChatHistory
        setConversationKey={setConversationKey}
        setMessages={setMessages}
        conversations={conversations}
        setConversations={setConversations}
        userId={user.id}
      />
      <ChatHeader
        conversationKey={conversationKey}
        setConversations={setConversations}
        setMessages={setMessages}
        onDeleteConversation={handleDeleteConversation}
      />
      <Chat
        messages={messages}
        setMessages={setMessages}
        conversationKey={conversationKey}
        sendMessage={(text) =>
          sendMessage(
            text,
            conversationKey,
            setMessages,
            setConversations,
            user.id
          )
        }
      />
      <ChatInput
        setMessages={setMessages}
        sendMessage={(text) =>
          sendMessage(
            text,
            conversationKey,
            setMessages,
            setConversations,
            user.id
          )
        }
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        conversationKey={conversationKey}
      />
      {/*
      <Info /> */}
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
