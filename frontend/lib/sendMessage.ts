import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { MessageItem } from "../components/Chat/Chat";

// * function to send message
export const sendMessage = async (
  text: string, // * message text 
  conversationKey: string, // * key for current conversation 
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>> // * function to update the messages state
) => {
  // * check if message content is empty 
  if (!text.trim()) {
    console.error("message content is empty");
    return;
  }

  // * create a new message object for user message 
  const newMessage: MessageItem = {
    key: uuidv4(), // * generate unique key for message 
    conversationKey,
    text: text.trim(),
    isUser: true,
    content: text,
    images: [],
    timestamp: new Date().toISOString(),
    sender: "user",
    date: new Date().toISOString(),
  };

  // * update the messages state with the new user message
  setMessages((prevMessages) => [...prevMessages, newMessage]);

  try {
    // * save message to the backend 
    await axios.post("/api/messages", {
      conversationKey,
      message: {
        key: newMessage.key,
        conversationKey: newMessage.conversationKey,
        text: newMessage.text,
        sender: newMessage.sender,
        content: newMessage.text,
        date: newMessage.date,
      },
    });

    // * send the user message to assistant and get response
    const response = await axios.post('/api/ask', { question: text.trim() });
    
    // * create new message object for assitant message 
    const assistantMessage: MessageItem = {
      key: uuidv4(), // * generate unique key for assistants message
      conversationKey,
      text: response.data.answer,
      isUser: false,
      images: [],
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      content: response.data.answer,
      sender: 'assistant'
    };

    // * update the messages state with the new user message 
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);

    // * save the assistant's response to the backend
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

  } catch (error) {
    // * handle any errors that occur during the message sending process
    console.error("error sending message:", error);
  }
};