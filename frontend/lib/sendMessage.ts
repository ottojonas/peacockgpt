import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { MessageItem } from "../components/Chat/Chat";
import { formatMessage } from "@/utils/formatMessage";

let isFirstUserMessageSet = false;
let isFirstAssistantMessageSet = false;

export const sendMessage = async (
<<<<<<< HEAD
  text: string,
  conversationKey: string,
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>,
  setConversations: React.Dispatch<React.SetStateAction<any[]>>
) => {
=======
  text: string, // message text
  conversationKey: string, // key for current conversation
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>, // function to update the messages state
  setConversations: React.Dispatch<React.SetStateAction<any[]>> // function to update the conversations state
) => {
  // * check if message content is empty
>>>>>>> ottojonas/issue5
  if (!text.trim()) {
    console.error("message content is empty");
    return;
  }

<<<<<<< HEAD
  const formattedText = formatMessage(text.trim());

  const newMessage: MessageItem = {
    key: uuidv4(),
    conversationKey,
=======
  // * format text in message
  const formattedText = formatMessage(text.trim());

  // * create a new message object for user message
  const newMessage: MessageItem = {
    key: uuidv4(), // * generate unique key for message
    conversationKey: conversationKey,
>>>>>>> ottojonas/issue5
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
<<<<<<< HEAD
=======
    // * wait for a short delay to ensure the conversation is indexed
    await new Promise((resolve) => setTimeout(resolve, 500));

    // * save message to the backend
>>>>>>> ottojonas/issue5
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
      await axios.put(`api/conversations?key=${conversationKey}`, updatedConversation);
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.key === conversationKey
            ? { ...conversation, ...updatedConversation }
            : conversation
        )
      );
      isFirstUserMessageSet = true;
    }

<<<<<<< HEAD
    const assistantResponse = await axios.post("/api/ask", { question: text.trim() });
    const formattedResponse = formatMessage(assistantResponse.data.answer);

=======
    // * send the user message to assistant and get response
    const assistantResponse = await axios.post("/api/ask", { question: text.trim() });

    // * format assistants response
    const formattedResponse = formatMessage(assistantResponse.data.answer);

    // * create new message object for assistant message
>>>>>>> ottojonas/issue5
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

<<<<<<< HEAD
=======
    // * update the messages state with the new user message
>>>>>>> ottojonas/issue5
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);

    await axios.post("/api/messages", {
      conversationKey,
      message: {
        key: assistantMessage.key,
        conversationKey: assistantMessage.conversationKey,
        text: assistantMessage.text,
        sender: assistantMessage.sender,
        content: assistantMessage.text,
        date: assistantMessage.date,
      },
    });

    if (!isFirstAssistantMessageSet) {
      const updatedConversation = {
        desc: assistantMessage.text.substring(0, 50),
      };
      await axios.put(`api/conversations?key=${conversationKey}`, updatedConversation);
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