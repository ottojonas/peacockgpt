import { NextApiRequest, NextApiResponse } from "next";
import multer, { Multer } from "multer";
import nextConnect from "next-connect";
import { v4 as uuidv4 } from "uuid";
import connectToDatabase from "../../lib/mongoose";
import TrainingDocument from "../../models/TrainingDocument";

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post(
  async (req: NextApiRequest & { file: Multer.File }, res: NextApiResponse) => {
    await connectToDatabase();

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, buffer } = req.file;
    const content = buffer.toString("utf-8");
    const key = uuidv4();

    const newDocument = new TrainingDocument({
      key,
      title: originalname,
      content,
    });

    try {
      await newDocument.save();
      res.status(201).json({
        message: "File uploaded successfully",
        document: newDocument._id,
      });
    } catch (error) {
      console.error("Error saving document:", error);
      res.status(500).json({ error: "Failed to save document" });
    }
  }
);

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
