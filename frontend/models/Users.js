import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Users || mongoose.model("Users", UserSchema);
