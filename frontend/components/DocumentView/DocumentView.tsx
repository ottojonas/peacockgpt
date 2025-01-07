import React, { useState, useEffect } from "react";
import axios from "axios";
import DocumentItem from "./DocumentItem/DocumentContentItem";

export type DocumentItemType = {
  key: string;
  title: string;
  content: string;
};

interface DocumentViewProps {
  documents: DocumentItemType[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItemType[]>>;
  documentKey: string;
  selectedDocumentKey: string;
  content: string;
}

const DocumentView: React.FC<DocumentViewProps> = ({
  documents,
  setDocuments,
  documentKey,
  selectedDocumentKey,
  content,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredDocuments, setFilteredDocuments] = useState<
    DocumentItemType[]
  >([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get("/api/documents", {
          params: { key: documentKey },
        });
        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) =>
            doc.key === documentKey
              ? { ...doc, content: response.data.content }
              : doc
          )
        );
      } catch (error) {
        console.error("Error fetching document data:", error);
      }
    };
    if (documentKey) {
      fetchContent();
    }
  }, [documentKey, setDocuments]);

  useEffect(() => {
    if (selectedDocumentKey) {
      const selectedDocuments = documents.filter(
        (doc) => doc.key === selectedDocumentKey
      );
      setFilteredDocuments(selectedDocuments);
      if (selectedDocuments.length > 0) {
        setInputValue(selectedDocuments[0].content);
      }
    } else {
      setFilteredDocuments([]);
    }
  }, [selectedDocumentKey, documents]);

  const saveContent = () => {
    const updatedDocuments = documents.map((doc) =>
      doc.key === documentKey ? { ...doc, content: inputValue } : doc
    );
    setDocuments(updatedDocuments);
  };

  return (
    <div
      className="document-container"
      style={{ marginLeft: "384px", marginRight: "320px" }}
    >
      <div className="w-full h-full px-4 pt-16 pb-48 mx-auto">
        {filteredDocuments.map((document) => (
          <DocumentItem document={document} key={document.key} />
        ))}
      </div>
    </div>
  );
};
export default DocumentView;
