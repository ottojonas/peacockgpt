import mongoose from "mongoose";
import Conversation from "./Conversation";

const MessageSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  conversationKey: {
    type: mongoose.Schema.Types.String,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  images: {
    type: String,
    required: false,
  },
});

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
