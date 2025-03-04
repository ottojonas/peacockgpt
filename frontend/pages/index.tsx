import React, { useState, useEffect } from "react";
import { MessageItem } from "../components/Chat/Chat";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../lib/sendMessage";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import CustomHead from "../components/common/CustomHead";
import ChatHistory from "../components/ChatHistory";
import ChatHeader from "../components/ChatHeader";
import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";
import io from "socket.io-client";
import Info from "../components/Info";

// * initialise socket connection
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("connect", () => {
  console.log("Socket connected successfully");
});

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [conversationKey, setConversationKey] = useState<string>("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const router = useRouter();
  const { isAuthenticated, userId } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (userId) {
      const fetchConversations = async () => {
        try {
          const response = await axios.get("/api/conversations", {
            params: { user_id: userId },
          });
          setConversations(response.data);
        } catch (error) {
          console.error("Error fetching conversations:", error);
        }
      };

      // Check if conversations are passed in the query
      if (router.query.conversations) {
        setConversations(JSON.parse(router.query.conversations as string));
      } else {
        fetchConversations();
      }
    }
  }, [isAuthenticated, router, userId]);

  // * effect to fetch messages when the conversation key changes
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
    }
  }, [conversationKey]);

  if (!isAuthenticated) {
    return null;
  }

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
      />
      <ChatHeader
        conversationKey={conversationKey}
        setConversations={setConversations}
        setMessages={setMessages}
        onDeleteConversation={handleDeleteConversation}
        userId={userId}
      />
      <Chat
        messages={messages}
        setMessages={setMessages}
        conversationKey={conversationKey}
        sendMessage={(text) =>
          sendMessage(
            text,
            conversationKey,
            userId,
            setMessages,
            setConversations
          )
        }
      />
      <ChatInput
        setMessages={setMessages}
        sendMessage={(text) =>
          sendMessage(
            text,
            conversationKey,
            userId,
            setMessages,
            setConversations
          )
        }
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        conversationKey={conversationKey}
      />
      <Info />
    </>
  );
}
