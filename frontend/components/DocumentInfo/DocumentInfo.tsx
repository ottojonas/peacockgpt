import React, { useEffect } from "react";
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
  setTitle: React.Dispatch<React.SetStateAction<DocumentInfoItem[]>>;
  setContent: React.Dispatch<React.SetStateAction<DocumentInfoItem[]>>;
  documentKey: string;
}

const DocumentInfo: React.FC<DocumentInfoProps> = ({
  documents,
  setTitle,
  setContent,
  documentKey,
}) => {
  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    const fetchDocumentInfo = async () => {
      try {
        const response = await axios.get("/api/documents", {
          params: { documentKey },
        });
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error("Could not fetch document title or content: ", error);
      }
    };
    if (documentKey) {
      fetchDocumentInfo();
    }
  }, [documentKey, setTitle, setContent]);

  return (
    <div
      className="documentContainer"
      style={{ marginLeft: "384px", marginRight: "320px" }}
    >
      <div className="px-4 pt-16 pb-48 mx-auto max-w-3x1 document-title">
        <DocumentTitle />
      </div>
      <div className="px-4 pt-16 pb-48 mx-auto max-w-3x1 document-content">
        <DocumentContent />
      </div>
    </div>
  );
};

export default DocumentInfo;
