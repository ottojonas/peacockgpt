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
import DocumentList from "../components/DocumentList/DocumentList";
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
  const [showDocuments, setShowDocuments] = useState(false);
  const router = useRouter();
  const { isAuthenticated, userId } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      axios
        .get("/api/conversations", {
          params: { user_id: userId },
        })
        .then((response) => {
          setConversations(response.data);
        });
    }
  }, [isAuthenticated, router]);

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
