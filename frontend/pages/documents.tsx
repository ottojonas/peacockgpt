import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import CustomHead from "../components/common/CustomHead";
import DocumentHistory from "../components/DocumentHistory/DocumentHistory";

interface DocumentItem {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
}

interface Props {
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setDocumenttKey: React.Dispatch<React.SetStateAction<string>>;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [content, setContent] = useState<string>("");

  return (
    <>
      <CustomHead title="Document Modification" />
      <Sidebar />
      <DocumentHistory
        documents={documents}
        setDocuments={setDocuments}
        setContent={setContent}
      />
    </>
  );
};

export default Documents;
