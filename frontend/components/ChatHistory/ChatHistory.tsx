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

type Props = {};

const createNewConversation = (): ItemProps => ({
  key: Date.now().toString(),
  isSelected: true,
  title: "test convo",
  desc: "test desc",
  date: new Date().toISOString(),
});

export default function ChatHistory({}: Props) {
  const [conversations, setConversations] = useState<ItemProps[]>([]);

  const handleNewConversation = async () => {
    const newConversation = createNewConversation();
    const updatedConversations = [...conversations, newConversation];
    setConversations([...conversations, newConversation]);

    try {
      await axios.post("/api/saveMessages", {
        conversations: updatedConversations,
      });
    } catch (error) {
      console.error("error saving conversations:", error);
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("/api/loadMessages");
        setConversations(response.data);
      } catch (error) {
        console.error("error fetching conversations:", error);
      }
    };
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
        {conversations.map((item) => (
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
}

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
