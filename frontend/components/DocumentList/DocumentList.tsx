import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Options from "../icons/Options";
import Times from "../icons/Times";
import PencilSquareIcon from "../icons/PencilSquareIcon";
import SearchIcon from "../icons/SearchIcon";
import ListAllIcon from "../icons/ListAllIcon";

type DocumentItem = {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
};

// const createNewDocument = (): DocumentProps => {
//   return {
//     key: uuidv4(),
//     title: "Placeholder",
//     content: "Placeholder",
//     isSelected: true,
//   };
// };

interface Props {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setContent: (content: DocumentItem[]) => void;
  setSelectedDocument: (document: DocumentItem) => void;
  setDocumentKey: (key: string) => void;
}

const DocumentList: React.FC<Props> = ({
  documents,
  setDocuments,
  setContent,
  setSelectedDocument,
  setDocumentKey,
}) => {
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("/api/documents");
      const fetchedDocuments: DocumentItem[] = response.data;
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDocumentClick = async (key: string) => {
    setDocuments((prevDocuments: DocumentItem[]): DocumentItem[] =>
      prevDocuments.map((doc: DocumentItem) =>
        doc.key === key
          ? { ...doc, isSelected: true }
          : { ...doc, isSelected: false }
      )
    );
    const selectedDocument = documents.find((document) => document.key === key);
    if (selectedDocument) {
      setSelectedDocument(selectedDocument);
      setDocumentKey(selectedDocument.key);
      try {
        const response = await axios.get("/api/documents", {
          params: { documentKey: selectedDocument.key },
        });
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching content");
      }
    } else {
      console.error("Document not found");
    }
  };

  return (
    <div className="fixed top-0 z-10 flex flex-col h-screen px-2 border-r-2 left-16 w-80 border-r-line bg-body">
      <div className="flex items-center px-3 py-3 shrink-0">
        <h2 className="text-lg font-semibold shrink-0">Documents</h2>
        <div className="grow"></div>
        <button>
          <Options className="w-7 h-7" />
        </button>
      </div>
      <div className="flex px-3 space-x-2 shrink-0">
        <div className="relative h-10 rounded-md grow bg-card">
          <input
            className="w-full h-10 pl-4 pr-10 rounded-md bg-card"
            spellCheck={false}
            data-ms-editor={false}
          />
          <div className="absolute inset-y-0 right-0 grid w-10 place-items-center">
            <SearchIcon className="w-5 h-5 text-brandGray" />
          </div>
        </div>
        <div
          className="grid w-10 h-10 rounded-md bg-brandWhite place-items-center shrink-0"
          // onClick={}
        >
          <PencilSquareIcon className="w-5 h-5 text-brandBlue" />
        </div>
      </div>
      <div className="flex items-center px-3 mt-4 mb-1 uppercase shrink-0">
        <ListAllIcon className="w-5 h-5" />
        <span className="ml-2 text-sm font-semibold">All</span>
      </div>
      <div className="grow">
        {documents.map((document) => (
          <DocumentHistoryItem
            key={document.key}
            document={document}
            onClick={() => {
              handleDocumentClick(document.key);
            }}
          />
        ))}
      </div>
    </div>
  );
};

function DocumentHistoryItem({
  document,
  onClick,
}: {
  document: DocumentItem;
  onClick: (key: string) => void;
}) {
  return (
    <div className="py-1">
      <div
        className={`px-3 py-2 text-sm w-full rounded-md ${
          document.isSelected ? "selected-document" : "bg-card"
        }`}
        onClick={() => onClick(document.key)}
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

export default DocumentList;
