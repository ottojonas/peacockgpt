import mongoose, { Document, Schema } from "mongoose";

export interface ITrainingDocument extends Document {
  key: string;
  title: string;
  content: string;
}

const TrainingDocumentSchema = new mongoose.Schema<ITrainingDocument>({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // isSelected: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
});

const TrainingDocument = mongoose.model<ITrainingDocument>(
  "TrainingDocument",
  TrainingDocumentSchema
);

export default TrainingDocument;
