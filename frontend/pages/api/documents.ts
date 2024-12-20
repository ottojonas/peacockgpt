import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
        const directoryPath = path.join(
        process.cwd(),
        "../data/annotated-documents"
      );
      // * console.log('directory path:', directoryPath);
      
      if (!fs.existsSync(directoryPath)) {
        console.error('directory doesnt exist:', directoryPath); 
        return res.status(500).json({ message: 'directory doesnt exist' });
      }

      const documents = fs.readdirSync(directoryPath).map((filename, index) => {
        const filePath = path.join(directoryPath, filename);
        // * console.log('reading file:', filePath)

        if (!fs.existsSync(filePath)) {
            console.error('file does not exist:', filePath);
            return res.status(500).json({ message: 'file does not exist' })
        }

        const content = fs.readFileSync(filePath, "utf-8");
        return { id: index + 1, title: filename, content };
      });
      
      res.status(200).json({ documents });
    } catch (error) {
      if (error instanceof Error) {
        console.error("error reading documents:", error.message);
        console.error("stack trace:", error.stack);
        res
          .status(500)
          .json({ message: "internal server error", error: error.message });
      } else {
        console.error("an unknown error occured");
        res.status(500).json({ message: "internal server error" });
      }
    }
  } else {
    res.status(405).json({ message: "method not allowed" });
  }
}
