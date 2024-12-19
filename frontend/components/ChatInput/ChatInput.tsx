import React, { useEffect } from "react";
import Send from "@/components/icons/Send";
import Mic from "@/components/icons/Mic";
import Refresh from "@/components/icons/Refresh";
import { formatMessage } from "@/utils/formatMessage";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// * define the structure of a message item
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

// * define the props for the ChatInput component
interface Props {
  sendMessage: (message: string) => void; // function to send a message
  inputValue: string; // the current input value
  setInputValue: (value: string) => void; // function to set the input value
  messages: MessageItem[]; //  array of message items
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>; // function to update the messages state
  conversationKey: string; // key of the current conversation
}

// * ChatInput component to handle user input and sending messages
const ChatInput: React.FC<Props> = ({
  sendMessage,
  inputValue,
  messages,
  setMessages,
  setInputValue,
  conversationKey,
}) => {
  // * handle change in the textarea input
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  // * handle key down event in the textarea input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // * fetch messages when the conversation key changes
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

  // * handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      console.error("message content is empty");
      return;
    }
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  // * hanle regnerating answer
  const handleRegenerateAnswer = async () => {
    try {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && !lastMessage.isUser) {
        const response = await axios.post("/api/ask", {
          question: lastMessage.text,
        });
        const newAnswer = response.data.answer;
        const formattedAnswer = formatMessage(newAnswer);

        const newMessage: MessageItem = {
          ...lastMessage,
          key: uuidv4(),
          text: formattedAnswer,
          content: formattedAnswer,
          timestamp: new Date().toISOString(),
          date: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        console.error(
          "no valid last message found or last message is from user"
        );
      }
    } catch (error) {
      console.error("error regenerating answer:", error);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 pt-8 bg-input">
      <div style={{ marginLeft: "384px", marginRight: "320px" }}>
        <div className="max-w-3xl px-4 pb-3 mx-auto">
          <div className="flex justify-center py-2">
            <button
              className="py-2.5 px-6 rounded-md bg-card flex items-center"
              onClick={handleRegenerateAnswer}>
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
