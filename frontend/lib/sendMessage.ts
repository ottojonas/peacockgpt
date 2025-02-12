import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { MessageItem } from "../components/Chat/Chat";
import { formatMessage } from "../utils/formatMessage";

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
    rating: "good",
  };

  setMessages((prevMessages) => [...prevMessages, newMessage]);

  try {
    // Ensure the conversation exists before saving the message
    const conversation = await axios.get(
      `/api/conversations?key=${conversationKey}`
    );
    if (!conversation.data) {
      console.error("Conversation not found");
      return;
    }

    // Save message to the backend
    const response = await axios.post("/api/messages", {
      conversationKey: conversationKey,
      message: {
        key: newMessage.key,
        conversationKey: newMessage.conversationKey,
        text: newMessage.text,
        sender: newMessage.sender,
        content: newMessage.content,
        date: newMessage.date,
        rating: "good",
      },
    });

    const savedMessage = response.data;

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.key === newMessage.key ? { ...msg, key: savedMessage.key } : msg
      )
    );

    if (!isFirstUserMessageSet) {
      const updatedConversation = {
        title: newMessage.text.substring(0, 20),
      };
      await axios.put(
        `api/conversations?key=${conversationKey}`,
        updatedConversation
      );
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.key === conversationKey
            ? { ...conversation, ...updatedConversation }
            : conversation
        )
      );
      isFirstUserMessageSet = true;
    }
  } catch (error) {
    console.error("Error sending message to backend: ", error);
  }

  try {
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
      rating: "good",
    };

    setMessages((prevMessages) => [...prevMessages, assistantMessage]);

    const response = await axios.post("/api/messages", {
      conversationKey,
      message: {
        key: assistantMessage.key,
        conversationKey: assistantMessage.conversationKey,
        text: assistantMessage.text,
        sender: assistantMessage.sender,
        content: assistantMessage.text,
        date: assistantMessage.date,
        rating: "good",
      },
    });

    const savedAssistantMessage = response.data;

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.key === assistantMessage.key
          ? { ...msg, key: savedAssistantMessage.key }
          : msg
      )
    );

    if (!isFirstAssistantMessageSet) {
      const updatedConversation = {
        desc: assistantMessage.text.substring(0, 30),
      };
      await axios.put(
        `api/conversations?key=${conversationKey}`,
        updatedConversation
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

    if (assistantMessage.rating === "bad") {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.key !== assistantMessage.key)
      );

      await axios.post("/api/badResponses", assistantMessage);
    }
  } catch (error) {
    console.error("Error sending assistant message to backend: ", error);
  }
};
