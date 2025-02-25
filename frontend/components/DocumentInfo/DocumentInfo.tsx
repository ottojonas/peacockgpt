import React, { useEffect, useState } from "react";
import axios from "axios";
import DocumentTitle from "./DocumentTitle/DocumentTitle";
import DocumentContent from "./DocumentContent/DocumentContent";
import SaveIcon from "../icons/SaveIcon";

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
      try {
        const response = await axios.get("/api/documents", {
          params: { key },
        });
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

  const handleInformationSave = async () => {
    try {
      const response = await axios.put(`/api/documents?key=${documentKey}`);
      const updatedDocumentInformation = response.data;
    } catch (error) {
      console.error("Error updating document information: ", error);
    }
  };

  return (
    <div
      className="documentContainer"
      style={{ marginLeft: "384px", marginRight: "320px" }}
    >
      <div className="px-4 pt-16 pb-48 mx-auto max-w-3x1 document-title">
        <DocumentTitle title={documentTitle} setTitle={setDocumentTitle} />
      </div>
      <div className="px-4 pt-16 pb-48 mx-auto max-w-3x1 document-content">
        <DocumentContent
          content={documentContent}
          setContent={setDocumentContent}
        />
      </div>
      <button
        className="grid rounded-md w-9 h-9 place-items-center bg-card"
        onClick={handleInformationSave}
      >
        <SaveIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default DocumentInfo;
