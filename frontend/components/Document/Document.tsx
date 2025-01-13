import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import DocumentArea from "./DocumentItem/DocumentArea";

export type DocumentItem = {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
};

interface DocumentProps {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  documentKey: string;
}

const Document: React.FC<DocumentProps> = ({
  documents,
  setDocuments,
  documentKey,
}) => {
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("/api/documents", {
          params: { documentKey },
        });
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    if (documentKey) {
      fetchDocuments();
    }
  }, [documentKey, setDocuments]);
  return (
    <div
      className="document-container"
      style={{ marginLeft: "348px", marginRight: "320px" }}
    >
      <div className="max-w-3xl px-4 pt-16 pb-48 mx-auto document-items">
        {documents.filter(Boolean).map((document) => (
          <DocumentArea document={document} key={document.key} />
        ))}
      </div>
    </div>
  );
};

export default Document;
