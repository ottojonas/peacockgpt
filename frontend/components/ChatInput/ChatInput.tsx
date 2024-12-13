import React, { useEffect, useState } from "react";
import Send from "@/components/icons/Send";
import Mic from "@/components/icons/Mic";
import Refresh from "@/components/icons/Refresh";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
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
      onSendMessage(message);
      setMessage("");
    } else {
      console.log("onSendMessage is undefined");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log("handleKeyDown called with key:", e.key);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    console.log("ChatInput component mounted");
    return () => {
      console.log("ChatInput component unmounted");
    };
  }, []);

  useEffect(() => {
    console.log(
      "ChatInput component received new onSendMessage:",
      onSendMessage
    );
  }, [onSendMessage]);

  return (
    <div className="fixed inset-x-0 bottom-0 pt-8 bg-input">
      <div style={{ marginLeft: "384px", marginRight: "320px" }}>
        <div className="max-w-3xl px-4 pb-3 mx-auto">
          <div className="flex justify-center py-2">
            <button
              className="py-2.5 px-6 rounded-md bg-card flex items-center"
              onClick={() => {}}>
              <Refresh className="w-5 h-5" />
              <span className="ml-2">Regenerate Anwser</span>
            </button>
          </div>
          <div className="relative rounded-md bg-card">
            <textarea
              rows={2}
              className="w-full px-4 py-2 rounded-md resize-none bg-card"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div
              className="absolute flex items-center space-x-3"
              style={{
                right: "16px",
                top: "50%",
                transform: "translate(0, -50%)",
              }}>
              <button
                className="grid w-10 h-10 text-white rounded-md place-items-center"
                onClick={() => {}}>
                <Mic className="w-5 h-5" />
              </button>
              <button
                className="grid w-10 h-10 text-black rounded-md place-items-center bg-brandWhite"
                onClick={handleSendMessage}>
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
