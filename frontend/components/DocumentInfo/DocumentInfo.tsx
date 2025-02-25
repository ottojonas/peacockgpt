import React, { useEffect, useState } from "react";
import axios from "axios";
import DocumentTitle from "./DocumentTitle/DocumentTitle";
import DocumentContent from "./DocumentContent/DocumentContent";

export type DocumentInfoItem = {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
};

interface DocumentInfoProps {
  documents: DocumentInfoItem[];
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  documentKey: string;
}

const DocumentInfo: React.FC<DocumentInfoProps> = ({
  documents,
  setTitle,
  setContent,
  documentKey,
}) => {
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [documentContent, setDocumentContent] = useState<string>("");

  useEffect(() => {
    const fetchDocumentInfo = async (key: string) => {
      console.log("Fetching document info for key: ", key);
      try {
        const response = await axios.get("/api/documents", {
          params: { key },
        });
        console.log("Document info fetched: ", response.data);
        const document: DocumentInfoItem | undefined = response.data.find(
          (doc: DocumentInfoItem) => doc.key === key
        );
        if (document) {
          setTitle(document.title);
          setDocumentTitle(document.title);
          setContent(document.content);
          setDocumentContent(document.content);
        }
      } catch (error) {
        console.error("Could not fetch document title or content: ", error);
      }
    };
    if (documentKey) {
      fetchDocumentInfo(documentKey);
    }
  }, [documentKey, setTitle, setContent]);

  return (
    <div
      className="documentContainer"
      style={{ marginLeft: "384px", marginRight: "320px" }}
    >
      <div className="px-4 pt-16 pb-48 mx-auto max-w-3x1 document-title">
        <DocumentTitle title={documentTitle} />
      </div>
      <div className="px-4 pt-16 pb-48 mx-auto max-w-3x1 document-content">
        <DocumentContent content={documentContent} />
      </div>
    </div>
  );
};

export default DocumentInfo;
