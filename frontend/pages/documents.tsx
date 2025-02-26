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

  const handleDocumentClick = async (key: string) => {
    try {
      const response = await axios.get("/api/documents", {
        params: { documentKey: key },
      });
      const document = response.data;
      setTitle(document.title);
      setContent(document.content);
      setDocumentKey(document.key);
    } catch (error) {
      console.error("Error fetching document data: ", error);
    }
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
      />
    </>
  );
};

export default withAdminAuth(Documents);
