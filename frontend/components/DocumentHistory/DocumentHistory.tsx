import React, { useEffect, useState } from "react";
import axios from "axios";
import Options from "../icons/Options";

type DocumentItem = {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
};

interface Props {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
}

const DocumentHistory: React.FC<Props> = ({ documents = [], setDocuments }) => {
  useEffect(() => {
    fetchDocuments();
  }, []);
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("/api/documents");
      const fetchedDocuments: DocumentItem[] = response.data;
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };
  return (
    <div className="fixed top-0 z-10 flex flex-col h-screen px-2 border-r-2 left-16 w-80 border-r-line bg-body">
      <div className="flex items-center px-3 py-3 shrink-0">
        <h2 className="text-lg font-semibold shrink-0">Documents</h2>
        <div className="grow"></div>
        <button>
          <Options className="2-7 h-7" />
        </button>
      </div>
      <div className="overflow-y-auto grow">
        {documents.map((document) => (
          <DocumentHistoryItem key={document.key} document={document} />
        ))}
      </div>
    </div>
  );
};

function DocumentHistoryItem({ document }: { document: DocumentItem }) {
  return (
    <div className="py-1">
      <div
        className={`px-3 py-2 test-sm w-full rounded-md ${
          document.isSelected ? "selected-document" : "bg-card"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold grow line-clamp-1">{document.title}</h3>
        </div>
        <p
          className={`line-clamp-2 mt-1 ${
            document.isSelected ? "text-black" : "text-brandGray"
          }`}
        >
          {document.content}
        </p>
      </div>
    </div>
  );
}

export default DocumentHistory;
