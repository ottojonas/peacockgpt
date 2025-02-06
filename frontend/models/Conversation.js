import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
