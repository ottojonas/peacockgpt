import React, { useEffect, useState } from "react";
import Send from "@/components/icons/Send";
import Mic from "@/components/icons/Mic";
import Refresh from "@/components/icons/Refresh";

type Props = {
  onSendMessage?: (message: string) => void;
};

export default function ChatInput({ onSendMessage }: Props) {
  console.log("onSendMessage prop:", onSendMessage);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("ChatInput component mounted");
    return () => {
      console.log("ChatInput component unmounted");
    };
  }, []);

  const handleSendMessage = () => {
    console.log("handleSendMessage called");
    if (message.trim() && onSendMessage) {
      console.log("calling onSendMessage with message:", message);
      onSendMessage(message);
      setMessage("");
    } else {
      console.log("onSendMessage is undefined or message is empty");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  console.log(
    "ChatInput component rendered with onSendMessage:",
    onSendMessage,
  );

  return (
    <div className="fixed inset-x-0 bottom-0 pt-8 bg-input">
      <div style={{ marginLeft: "384px", marginRight: "320px" }}>
        <textarea
          className="w-full p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}