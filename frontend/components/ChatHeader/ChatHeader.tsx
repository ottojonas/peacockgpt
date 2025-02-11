import ChatIcon from "../../components/icons/ChatIcon";
import TrashIcon from "../../components/icons/TrashIcon";
import SaveIcon from "../../components/icons/SaveIcon";
import React from "react";
import axios from "axios";
import { MessageItem } from "../../components/Chat/Chat";

interface ItemProps {
  key: string;
  title: string;
  desc: string;
  date: string;
  isSelected: boolean;
  isPinned: boolean;
}

interface ChatHeaderProps {
  conversationKey: string;
  setConversations: React.Dispatch<React.SetStateAction<ItemProps[]>>;
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  onDeleteConversation: (conversationKey: string) => void;
  userId: string; 
}

export default function ChatHeader({
  conversationKey,
  setConversations,
  setMessages,
  onDeleteConversation,
  userId, 
}: ChatHeaderProps) {
  const handleDeleteConversation = async () => {
    try {
      await axios.delete(`/api/conversations?key=${conversationKey}`, {
	      params: { user_id: userId}
      });
      setConversations((prevConversations) =>
        prevConversations.filter(
          (conversation) => conversation.key !== conversationKey
        )
      );
      setMessages([]);
      onDeleteConversation(conversationKey);
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10">
      <div
        className="z-10 border-b bg-body border-b-line bg-opacity-30 backdrop-blur-md"
        style={{ marginLeft: "384px", marginRight: "320px" }}
      >
        <div className="flex items-center justify-between max-w-3xl px-4 py-2 mx-auto">
          <div className="inline-flex items-center">
            <ChatIcon className="w-6 h-6" />
            <h1 className="ml-2 text-xl font-semibold">PeacockGPT</h1>
          </div>
          <div className="inline-flex items-center space-x-3">
            <button
              className="grid rounded-md w-9 h-9 place-items-center bg-card"
              onClick={handleDeleteConversation}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            {/* 
            <button
              className="grid rounded-md w-9 h-9 place-items-center bg-card"
              onClick={() => {}}>
              <SaveIcon className="w-5 h-5" />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
