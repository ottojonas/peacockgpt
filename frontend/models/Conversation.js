import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
