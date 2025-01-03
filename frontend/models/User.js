import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  secretKey: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
