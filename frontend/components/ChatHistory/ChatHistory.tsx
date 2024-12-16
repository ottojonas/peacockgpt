import React, { useEffect, useState } from "react";
import axios from "axios";
import Options from "@/components/icons/Options";
import Times from "@/components/icons/Times";
import PencilSquareIcon from "@/components/icons/PencilSquareIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import PinnedIcon from "@/components/icons/PinnedIcon";
import ListAllIcon from "@/components/icons/ListAllIcon";

type ItemProps = {
  key: string;
  title: string;
  desc: string;
  date: string;
  isSelected: boolean;
};

type Props = { setConversationKey: (key: string) => void };

const createNewConversation = (): ItemProps => {
  const formatDate = (date: Date) => {
    const opeions: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-GB", opeions).format(date);
  };

  const now = new Date();

  return {
    key: now.toISOString(),
    isSelected: true,
    title: "test",
    desc: "desc",
    date: now.toISOString(),
  };
};

const ChatHistory: React.FC<Props> = ({ setConversationKey }) => {
  const [conversations, setConversations] = useState<ItemProps[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ItemProps | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleNewConversation = async () => {
    const now = new Date();

    const newConversation = {
      title: "new conversation",
      desc: "desc",
      date: now.toISOString(),
    };

    try {
      console.log("Sending new conversation:", newConversation);
      const response = await fetch("http://localhost:3000/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConversation),
      });
      const data = await response.json();
      console.log(data);

      setConversations([
        ...conversations,
        { ...newConversation, key: data.id, isSelected: false },
      ]);
    } catch (error) {
      console.error("Error saving conversations:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get("/api/conversations");
      const formattedConversations = response.data.map((conversation: any) => {
        const date = new Date(conversation.date);
        return {
          ...conversation,
          date: isNaN(date.getTime())
            ? "Invalid Date"
            : new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              }).format(date),
        };
      });
      setConversations(formattedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationKey: string) => {
    try {
      const response = await axios.get(
        `/api/messages?conversationKey=${conversationKey}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSelectConversation = (conversation: ItemProps) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.key);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation) return;

    try {
      const response = await axios.post("/api/messages", {
        conversationKey: selectedConversation.key,
        content: newMessage,
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="fixed top-0 z-10 flex flex-col h-screen px-2 border-r-2 left-16 w-80 border-r-line bg-body">
      <div className="flex items-center px-3 py-3 shrink-0">
        <h2 className="text-lg font-semibold shrink-0 ">Chats</h2>
        <div className="grid w-8 h-8 ml-2 text-sm font-semibold text-black rounded-full shrink-0 bg-brandWhite place-items-center">
          {conversations.length}
        </div>
        <div className="grow"> </div>
        <button>
          <Options className="w-7 h-7" />
        </button>
      </div>
      <div className="flex px-3 space-x-2 shrink-0">
        <div className="relative h-10 rounded-md grow bg-card">
          <input className="w-full h-10 pl-4 pr-10 rounded-md bg-card" />
          <div className="absolute inset-y-0 right-0 grid w-10 place-items-center">
            <SearchIcon className="w-5 h-5 text-brandGray" />
          </div>
        </div>
        <div
          className="grid w-10 h-10 rounded-md bg-brandWhite place-items-center shrink-0"
          onClick={handleNewConversation}>
          <PencilSquareIcon className="w-5 h-5 text-brandBlue" />
        </div>
      </div>
      <div className="flex items-center px-3 mt-4 mb-1 uppercase shrink-0">
        <PinnedIcon className="w-5 h-5" />
        <span className="ml-2 text-sm font-semibold">pinned</span>
      </div>
      <div className="shrink-0">
        {conversations
          .filter((item) => item.isSelected)
          .map((item) => (
            <Item item={item} key={item.key} />
          ))}
      </div>
      <div className="flex items-center px-3 mt-4 mb-1 uppercase shrink-0">
        <ListAllIcon className="w-5 h-5" />
        <span className="ml-2 text-sm font-semibold">all</span>
      </div>
      <div className="grow">
        {conversations
          .filter((item) => !item.isSelected)
          .map((item) => (
            <Item item={item} key={item.key} />
          ))}
      </div>
      <div className="px-2 py-3 shrink-0">
        <button
          className="flex items-center justify-center w-full py-2 text-sm font-semibold rounded-md bg-card"
          onClick={() => {}}>
          <Times className="w-5 h-5" />
          <span className="ml-2">Clear All Chats</span>
        </button>
      </div>
    </div>
  );
};

function Item({ item }: { item: ItemProps }) {
  return (
    <div className="py-1">
      <div
        className={`px-3 py-2 text-sm w-full rounded-md ${
          item.isSelected ? "bg-card" : ""
        }`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold grow line-clamp-1">{item.title}</h3>
          <span className="pl-2 shrink-0">{item.date}</span>
        </div>

        <p
          className={`line-clamp-2 mt-1 ${
            item.isSelected ? "text-white" : "text-brandGray"
          }`}>
          {item.desc}
        </p>
      </div>
    </div>
  );
}

export default ChatHistory;
