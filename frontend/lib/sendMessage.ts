import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { MessageItem } from "../components/Chat/Chat";
import { formatMessage } from "@/utils/formatMessage";
import { updateConversation } from "./updateConversation";

let isFirstUserMessageSet = false;
let isFirstAssistantMessageSet = false;

export const sendMessage = async (
  text: string,
  conversationKey: string,
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>,
  setConversations: React.Dispatch<React.SetStateAction<any[]>>
) => {
  if (!text.trim()) {
    console.error("message content is empty");
    return;
  }

  const formattedText = formatMessage(text.trim());

  const newMessage: MessageItem = {
    key: uuidv4(),
    conversationKey,
    text: formattedText,
    isUser: true,
    content: formattedText,
    images: [],
    timestamp: new Date().toISOString(),
    sender: "user",
    date: new Date().toISOString(),
  };

  setMessages((prevMessages) => [...prevMessages, newMessage]);

  try {
    const conversation = await axios.get(
      `/api/conversations?key=${conversationKey}`
    );
    if (!conversation.data) {
      console.error("Conversation not found");
      return;
    }

    await axios.post("/api/messages", {
      conversationKey: conversationKey,
      message: {
        key: newMessage.key,
        conversationKey: newMessage.conversationKey,
        text: newMessage.text,
        sender: newMessage.sender,
        content: newMessage.text,
        date: newMessage.date,
      },
    });

    if (!isFirstUserMessageSet) {
      const updatedConversation = {
        title: newMessage.text.substring(0, 20),
      };
      await updateConversation(conversationKey, updatedConversation.title, "");
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.key === conversationKey
            ? { ...conversation, ...updatedConversation }
            : conversation
        )
      );
      isFirstAssistantMessageSet = true;
    }

    const assistantResponse = await axios.post("/api/ask", {
      question: text.trim(),
    });
    const formattedResponse = formatMessage(assistantResponse.data.answer);

    const assistantMessage: MessageItem = {
      key: uuidv4(),
      conversationKey,
      text: formattedResponse,
      isUser: false,
      images: [],
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      content: formattedResponse,
      sender: "assistant",
    };

    setMessages((prevMessages) => [...prevMessages, assistantMessage]);

    await axios.post("/api/messages", {
      conversationKey,
      message: {
        key: assistantMessage.key,
        conversationKey: assistantMessage.conversationKey,
        text: assistantMessage.text,
        sender: assistantMessage.sender,
        content: assistantMessage.content,
        date: assistantMessage.date,
      },
    });

    if (!isFirstAssistantMessageSet) {
      const updatedConversation = {
        desc: assistantMessage.text.substring(0, 20),
      };
      await updateConversation(
        conversationKey,
        updatedConversation.title,
        updatedConversation.desc
      );
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.key === conversationKey
            ? { ...conversation, ...updatedConversation }
            : conversation
        )
      );
      isFirstAssistantMessageSet = true;
    }
  } catch (error) {
    console.error("error sending message:", error);
  }
};
