import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DocumentList from "../components/DocumentList/DocumentList";
import CustomHead from "../components/common/CustomHead";
import { DocumentProps } from "../components/DocumentList/DocumentList";
import DocumentView from "../components/DocumentView/DocumentView";
import DocumentModification from "../components/DocumentModification/DocumentModification";
const Documents = () => {
  const [documents, setDocuments] = useState<DocumentProps[]>([]);
  const [key, setKey] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedDocumentKey, setSelectedDocumentKey] = useState<string>("");

  const saveContent = (newContent: string) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.key === key ? { ...doc, content: newContent } : doc
      )
    );
  };

  return (
    <>
      <CustomHead title="Document Modification" />
      <Sidebar />
      <DocumentList
        setKey={setKey}
        setDocuments={setDocuments}
        documents={documents}
        setContent={setContent}
        setSelectedDocumentKey={setSelectedDocumentKey}
      />
      <DocumentView
        documents={documents}
        setDocuments={setDocuments}
        documentKey={key}
        selectedDocumentKey={selectedDocumentKey}
        content={content}
      />
    </>
  );
};

export default Documents;
