import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import TrainingDocument from "./TrainingDocument.js";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log("MONGODB_URI:", MONGODB_URI);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function populateTrainingDocuments() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined in the environmental variables"
    );
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const dirPath = path.join(__dirname, "../../data/training-documents/text");
  console.log("Reading files from directory:", dirPath);
  const trainingDocuments = [];

  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath, "utf-8");
      trainingDocuments.push({ key: uuidv4(), title: file, content });
    }
  });

  console.log("Training documents to be inserted:", trainingDocuments);

  try {
    await TrainingDocument.insertMany(trainingDocuments);
    console.log("Success");
  } catch (error) {
    console.error("Error uploading documents:", error);
  } finally {
    mongoose.connection.close();
  }
}

populateTrainingDocuments();
