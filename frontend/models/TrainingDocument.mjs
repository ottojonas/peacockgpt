import mongoose from "mongoose";

const TrainingDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const TrainingDocument =
  mongoose.models.TrainingDocument ||
  mongoose.model("TrainingDocument", TrainingDocumentSchema);

export default TrainingDocument;
