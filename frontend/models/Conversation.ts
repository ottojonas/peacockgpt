import mongoose, { Document, Schema } from "mongoose";

export interface IConversation {
  key: string;
  title: string;
  desc: string;
  date: string;
  isSelected: boolean;
  isPinned: boolean;
  user_id: mongoose.Schema.Types.ObjectId;
}

const ConversationSchema: Schema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    required: true,
    default: false,
  },
  isPinned: {
    type: Boolean,
    required: true,
    default: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
