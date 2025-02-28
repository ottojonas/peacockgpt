import React, { useEffect, useState } from "react";
import axios from "axios";
import DocumentTitle from "./DocumentTitle/DocumentTitle";
import DocumentContent from "./DocumentContent/DocumentContent";
import SaveIcon from "../icons/SaveIcon";
import { useSession } from "next-auth/react";
import TrashIcon from "../icons/TrashIcon";

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
  setDocuments: React.Dispatch<React.SetStateAction<DocumentInfoItem[]>>;
  onDeleteDocument: (documentKey: string) => void;
}

const DocumentInfo: React.FC<DocumentInfoProps> = ({
  documents,
  setTitle,
  setContent,
  documentKey,
  setDocuments,
  onDeleteDocument,
}) => {
  const { data: session } = useSession();
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

  const handleDocumentUpdate = async (
    key: string,
    title: string,
    content: string
  ) => {
    try {
      const updatedDocument = {
        title,
        content,
      };
      const response = await axios.put(
        `/api/documents?key=${key}`,
        updatedDocument
      );
      setDocuments((prevDocuments) =>
        prevDocuments.map((document) =>
          document.key === key ? { ...document, title, content } : document
        )
      );
      console.log("Document information updated successfully: ", response.data);
    } catch (error) {
      console.error(
        "Error updated document information: ",
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteDocument = async (key: string) => {
    try {
      await axios.delete(`/api/documents?key=${key}`);
      setDocuments((prevDocuments) =>
        prevDocuments.filter((document) => document.key !== documentKey)
      );
      onDeleteDocument(documentKey);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div
      className="documentContainer"
      style={{ marginLeft: "384px", marginRight: "320px" }}
    >
      <div className="px-4 pt-16 pb-24 mx-auto max-w-3x1 document-title">
        <DocumentTitle title={documentTitle} setTitle={setDocumentTitle} />
      </div>
      <div className="px-4 pb-24 mx-auto max-w-3x1 document-content">
        <DocumentContent
          content={documentContent}
          setContent={setDocumentContent}
        />
      </div>
      <div className="px-2 py-2 shrink-0">
        <button
          className="flex items-center justify-center w-full py-2 text-sm font-semibold text-black bg-green-500 rounded-md"
          onClick={() =>
            handleDocumentUpdate(documentKey, documentTitle, documentContent)
          }
        >
          <SaveIcon className="w-5 h-5" />
          <span className="ml-2">Save Changes</span>
        </button>
      </div>
      <div className="px-2 py-2 shrink-0">
        <button
          className="flex items-center justify-center w-full py-2 text-sm font-semibold text-black bg-red-600 rounded-md"
          onClick={() => handleDeleteDocument(documentKey)}
        >
          <TrashIcon className="w-5 h-5" />
          <span className="ml-2">Delete Document</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentInfo;
