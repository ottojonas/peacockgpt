import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import CustomHead from "../components/common/CustomHead";
import DocumentHistory from "../components/DocumentHistory/DocumentHistory";
import DocumentInfo from "../components/DocumentInfo/DocumentInfo";
import axios from "axios";
import withAdminAuth from "../middleware/withAdminAuth";

interface DocumentItem {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [documentKey, setDocumentKey] = useState<string>("");

  const handleDeleteDocument = (key: string) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((document) => document.key !== key)
    );
    setDocuments([]);
    setDocumentKey("");
  };

  return (
    <>
      <CustomHead title="Document Modification" />
      <Sidebar />
      <DocumentHistory
        documents={documents}
        setDocuments={setDocuments}
        setContent={setContent}
        setTitle={setTitle}
        setDocumentKey={setDocumentKey}
      />
      <DocumentInfo
        documents={documents}
        setTitle={setTitle}
        setContent={setContent}
        documentKey={documentKey}
        setDocuments={setDocuments}
        onDeleteDocument={handleDeleteDocument}
      />
    </>
  );
};

export default withAdminAuth(Documents);
