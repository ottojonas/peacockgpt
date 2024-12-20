import mongoose from "mongoose";
import TrainingDocument from "./TrainingDocument.mjs";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
// * console.log("mongodb_uri:", MONGODB_URI);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function populateTrainingDocuments() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const directoryPath = path.join(
    __dirname,
    "../../data/training-documents/text"
  );
  const trainingDocuments = [];

  fs.readdirSync(directoryPath).forEach((file) => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath, "utf-8");
      trainingDocuments.push({ title: file, content });
    }
  });

  try {
    await TrainingDocument.insertMany(trainingDocuments);
    // * console.log("success");
  } catch (error) {
    console.error("error:", error);
  } finally {
    mongoose.connection.close();
  }
}

populateTrainingDocuments();
