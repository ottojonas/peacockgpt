import React, { useState } from "react";
import CustomHead from "../components/common/CustomHead";
import Sidebar from "../components/Sidebar";
import DocumentList from "../components/DocumentList/DocumentList";

interface DocumentItem {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
}

interface Props {
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setDocumentKey: React.Dispatch<React.SetStateAction<string>>;
}

const Documents: React.FC<Props> = ({ setDocuments, setDocumentKey }) => {
  return (
    <>
      <CustomHead title="PeacockGPT" />
      <Sidebar />
      <DocumentList
        setDocuments={setDocuments}
        setDocumentKey={setDocumentKey}
      />
    </>
  );
};

export default Documents;
