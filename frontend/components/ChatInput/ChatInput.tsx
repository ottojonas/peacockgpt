import React, { useEffect, useState } from "react";
import Send from "@/components/icons/Send";
import Mic from "@/components/icons/Mic";
import Refresh from "@/components/icons/Refresh";
import axios from "axios";

type Image = {
  key: number;
  url: string;
};

type MessageItem = {
  key: string;
  conversationKey: string;
  isUser: boolean;
  sender: string;
  text: string;
  images: { key: number; url: string }[];
  timestamp: string;
  date: string;
  content: string;
};

interface Props {
  sendMessage: (message: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  messages: MessageItem[];
  conversationKey: string;
}

const ChatInput: React.FC<Props> = ({
  sendMessage,
  inputValue,
  setInputValue,
  messages,
  conversationKey,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        console.log("fetching messages with conversationKey:", conversationKey);
        const response = await axios.get(`/api/messages`, {
          params: { conversationKey: conversationKey },
        });
        console.log(response.data);
      } catch (error) {
        console.error("error loading messages:", error);
      }
    };

    if (conversationKey) {
      fetchMessage();
    }

    return () => {
      console.log("cleanup for conversationKey:", conversationKey);
    };
  }, [conversationKey]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      console.error("message content is empty");
      return;
    }
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 pt-8 bg-input">
      <div style={{ marginLeft: "384px", marginRight: "320px" }}>
        <div className="max-w-3xl px-4 pb-3 mx-auto">
          <div className="flex justify-center py-2">
            <button
              className="py-2.5 px-6 rounded-md bg-card flex items-center"
              onClick={() => {}}
            >
              <Refresh className="w-5 h-5" />
              <span className="ml-2">Regenerate Answer</span>
            </button>
          </div>
          <div className="relative rounded-md bg-card">
            <textarea
              rows={2}
              className="w-full px-4 py-2 rounded-md resize-none bg-card"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
            />
            <div
              className="absolute flex items-center space-x-3"
              style={{
                right: "16px",
                top: "50%",
                transform: "translate(0, -50%)",
              }}
            >
              <button
                className="grid w-10 h-10 text-white rounded-md place-items-center"
                onClick={() => {}}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                className="grid w-10 h-10 text-black rounded-md place-items-center bg-brandWhite"
                onClick={handleSendMessage}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
