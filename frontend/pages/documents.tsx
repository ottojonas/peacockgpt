import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DocumentList from "../components/DocumentList/DocumentList";
import CustomHead from "../components/common/CustomHead";
import { DocumentProps } from "../components/DocumentList/DocumentList";

interface DocumentItem {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
}

const Documents = () => {
  const [documents, setDocuments] = useState<DocumentProps[]>([]);
  const [documentKey, setDocumentKey] = useState<string>("");
  const [content, setContent] = useState<string>("");

  return (
    <>
      <CustomHead title="Document Modification" />
      <Sidebar />
      <DocumentList
        setDocumentKey={setDocumentKey}
        setContent={setContent}
        documents={documents}
        setDocuments={setDocuments}
      />
    </>
  );
};

export default Documents;
