import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { createRouter } from "next-connect";
import { v4 as uuidv4 } from "uuid";
import connectToDatabase from "../../lib/mongoose";
import TrainingDocument from "../../models/TrainingDocument";

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = createRouter<NextApiRequest, NextApiResponse>();

// Create a middleware function that properly handles multer file upload
const multerMiddleware = async (
  req: NextApiRequest & { file?: Express.Multer.File },
  res: NextApiResponse,
  next: () => void
) => {
  try {
    // Process the upload manually
    const multerSingle = upload.single("file");
    await new Promise<void>((resolve, reject) => {
      multerSingle(req as any, res as any, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Multer error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};

// Apply the middleware
apiRoute.use(multerMiddleware);

apiRoute.post(
  async (
    req: NextApiRequest & { file?: Express.Multer.File },
    res: NextApiResponse
  ) => {
    await connectToDatabase();

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
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
        document: newDocument.key,
        title: newDocument.title,
        content: newDocument.content,
      });
    } catch (error) {
      console.error("Error saving document:", error);
      res.status(500).json({ error: "Failed to save document" });
    }
  }
);

export default apiRoute.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
  onNoMatch: (req, res) => {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};
