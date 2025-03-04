import mongoose from "mongoose";

const BadResponseSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  conversationKey: {
    type: String,
    ref: "Conversation",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isUser: {
    type: Boolean,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sender: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  rating: {
    type: String,
    enum: ["good", "bad"],
    default: "good",
  },
});

const BadResponse =
  mongoose.models.BadResponse ||
  mongoose.model("BadResponse", BadResponseSchema);

export default BadResponse;
