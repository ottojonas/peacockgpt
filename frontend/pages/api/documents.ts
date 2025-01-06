import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/mongoose";
import { v4 as uuidv4 } from "uuid";
import TrainingDocument from "../../models/TrainingDocument";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const trainingDocuments = await TrainingDocument.find({});
      res.status(200).json(trainingDocuments);
    } catch (error) {
      console.error("Error loading documents:", error);
      res.status(500).json({ error: "Failed to load documents" });
    }
  } else if (req.method === "POST") {
    try {
      const { title, content } = req.body;
      const key = uuidv4();
      if (!title || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newDocument = new TrainingDocument({ key, title, content });
      await newDocument.save();
      res.status(201).json({ if: newDocument._id, key: newDocument.key });
    } catch (error) {
      console.error("Error saving conversation:", error);
      res.status(500).json({ error: "Failed to save conversation" });
    }
  } else if (req.method === "PUT") {
    try {
      const { key } = req.query;
      const { title, content } = req.body;
      const updatedData: any = {};
      if (title !== undefined) updatedData.title = title;
      if (content !== undefined) updatedData.content = content;

      const updatedDocument = await TrainingDocument.findOneAndUpdate(
        { key },
        updatedData,
        { new: true }
      );

      if (!updatedDocument) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.status(200).json(updatedDocument);
    } catch (error) {
      console.error("Error updating document");
      res.status(500).json({ error: "Failed to update document" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { key } = req.query;
      await TrainingDocument.findOneAndDelete({ key });
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting documents:", error);
      res.status(500).json({ error: "Failed to delete documents" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
