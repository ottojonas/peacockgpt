import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Options from "../../components/icons/Options";
import Times from "../../components/icons/Times";
import PencilSquareIcon from "../../components/icons/PencilSquareIcon";
import SearchIcon from "../../components/icons/SearchIcon";
import PinnedIcon from "../../components/icons/PinnedIcon";
import ListAllIcon from "../../components/icons/ListAllIcon";
import { MessageItem } from "../Chat/Chat";
import { useAuth } from "../../context/AuthContext";

type ItemProps = {
  key: string;
  title: string;
  desc: string;
  date: string;
  isSelected: boolean;
  isPinned: boolean;
  user_id: string;
};

const createNewConversation = (userId: string): ItemProps => {
  const now = new Date();
  return {
    key: uuidv4(),
    title: "New Conversation",
    desc: "Description",
    date: now.toISOString(),
    isSelected: true,
    isPinned: false,
    user_id: userId,
  };
};

type Props = {
  setConversationKey: (key: string) => void;
  setMessages: (messages: MessageItem[]) => void;
  conversations: any[];
  setConversations: React.Dispatch<React.SetStateAction<any[]>>;
};

const ChatHistory: React.FC<Props> = ({
  setConversationKey,
  setMessages,
  conversations = [],
  setConversations,
}) => {
  const [selectedConversation, setSelectedConversation] =
    useState<ItemProps | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get("/api/conversations", {
        params: { user_id: userId },
      });
      const formattedConversations = response.data.map((conversation: any) => {
        const date = new Date(conversation.date);
        return {
          ...conversation,
          date: isNaN(date.getTime())
            ? new Date().toISOString()
            : date.toISOString(),
          isSelected: false,
        };
      });
      formattedConversations.sort(
        (a: { date: string }, b: { date: string }) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setConversations(formattedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleConversationClick = async (key: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((conversation) =>
        conversation.key === key
          ? { ...conversation, isSelected: true }
          : { ...conversation, isSelected: false }
      )
    );
    const selectedConversation = conversations.find(
      (conversation) => conversation.key === key
    );
    if (selectedConversation) {
      setSelectedConversation(selectedConversation);
      setConversationKey(selectedConversation.key);
      try {
        const response = await axios.get("/api/messages", {
          params: { conversationKey: selectedConversation.key },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    } else {
      console.error("Conversation not found");
    }
  };

  const handlePinConversation = async (key: string) => {
    const updatedConversations = conversations.map((conversation) =>
      conversation.key === key
        ? { ...conversation, isPinned: !conversation.isPinned }
        : conversation
    );
    setConversations(updatedConversations);
    const pinnedConversation = updatedConversations.find(
      (conversation) => conversation.key === key
    );
    if (pinnedConversation) {
      try {
        await axios.put(`/api/conversations?key=${key}`, {
          isPinned: pinnedConversation.isPinned,
        });
      } catch (error) {
        console.error("Error updating pinned state:", error);
      }
    }
  };

  const handleNewConversation = async () => {
    const newConversation = createNewConversation(userId);
    try {
      const response = await axios.post("/api/conversations", {
        ...newConversation,
        user_id: userId,
      });
      const data = response.data;
      const updatedConversation = { ...newConversation, key: data.key };
      setConversations((prevConversations = []) => [
        ...prevConversations.map((conv) => ({ ...conv, isSelected: false })),
        updatedConversation,
      ]);
      setSelectedConversation(updatedConversation);
      setConversationKey(updatedConversation.key);
      setMessages([]);
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  const handleClearAllChats = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      // Get all conversation keys before deleting
      const conversationKeys = conversations.map((conv) => conv.key);

      // Delete all conversations
      await axios.delete("/api/conversations", {
        params: { user_id: userId },
      });

      // Delete all messages for each conversation
      for (const key of conversationKeys) {
        await axios.delete("/api/messages", {
          params: { conversationKey: key },
        });
      }

      setConversations([]);
      setSelectedConversation(null);
      setMessages([]);
    } catch (error) {
      console.error("Error clearing all chats:", error);
    }
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
  };

  return (
    <div className="fixed top-0 z-10 flex flex-col h-screen px-2 border-r-2 left-16 w-80 border-r-line bg-body">
      <div className="flex items-center px-3 py-3 shrink-0">
        <h2 className="text-lg font-semibold shrink-0">Chats</h2>
        <div className="grid w-8 h-8 ml-2 text-sm font-semibold text-black rounded-full shrink-0 bg-brandWhite place-items-center">
          {conversations.length}
        </div>
        <div className="grow"></div>
        <button>
          <Options className="w-7 h-7" />
        </button>
      </div>
      <div className="flex px-3 space-x-2 shrink-0">
        <div className="relative h-10 rounded-md grow bg-card">
          <input
            className="w-full h-10 pl-4 pr-10 rounded-md bg-card"
            spellCheck={false}
            data-ms-editor={false}
          />
          <div className="absolute inset-y-0 right-0 grid w-10 place-items-center">
            <SearchIcon className="w-5 h-5 text-brandGray" />
          </div>
        </div>
        <div
          className="grid w-10 h-10 rounded-md bg-brandWhite place-items-center shrink-0"
          onClick={handleNewConversation}
        >
          <PencilSquareIcon className="w-5 h-5 text-brandBlue" />
        </div>
      </div>
      <div className="flex items-center px-3 mt-4 mb-1 uppercase shrink-0">
        <PinnedIcon className="w-5 h-5" />
        <span className="ml-2 text-sm font-semibold">Pinned</span>
      </div>
      <div className="shrink-0">
        {conversations
          .filter((item) => item.isPinned)
          .map((item) => (
            <Item
              item={item}
              key={item.key}
              onClick={handleConversationClick}
              onPin={handlePinConversation}
              formatDate={formatDate}
            />
          ))}
      </div>
      <div className="flex items-center px-3 mt-4 mb-1 uppercase shrink-0">
        <ListAllIcon className="w-5 h-5" />
        <span className="ml-2 text-sm font-semibold">All</span>
      </div>
      <div className="grow">
        {conversations
          .filter((item) => !item.isPinned)
          .map((item) => (
            <Item
              item={item}
              key={item.key}
              onClick={handleConversationClick}
              onPin={handlePinConversation}
              formatDate={formatDate}
            />
          ))}
      </div>
      <div className="px-2 py-3 shrink-0">
        <button
          className="flex items-center justify-center w-full py-2 text-sm font-semibold rounded-md bg-card"
          onClick={handleClearAllChats}
        >
          <Times className="w-5 h-5" />
          <span className="ml-2">Clear All Chats</span>
        </button>
      </div>
    </div>
  );
};

function Item({
  item,
  onClick,
  onPin,
  formatDate,
}: {
  item: ItemProps;
  onClick: (key: string) => void;
  onPin: (key: string) => void;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="py-1">
      <div
        className={`px-3 py-2 text-sm w-full rounded-md ${
          item.isSelected ? "selected-conversation" : "bg-card"
        }`}
        onClick={() => onClick(item.key)}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold grow line-clamp-1">{item.title}</h3>
          <div className="flex flex-col items-end">
            <span className="pl-2 shrink-0">{formatDate(item.date)}</span>
            <button onClick={() => onPin(item.key)}>
              <PinnedIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
        <p
          className={`line-clamp-2 mt-1 ${
            item.isSelected ? "text-black" : "text-brandGray"
          }`}
        >
          {item.desc}
        </p>
      </div>
    </div>
  );
}

export default ChatHistory;
