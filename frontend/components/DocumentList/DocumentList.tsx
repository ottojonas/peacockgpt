import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Options from "../icons/Options";
import SearchIcon from "../icons/SearchIcon";
import PencilSquareIcon from "../icons/PencilSquareIcon";

export type DocumentProps = {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
};

type Props = {
  setDocumentKey: (key: string) => void;
  setContent: (content: string) => void;
  documents: any[];
  setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
};

const DocumentList: React.FC<Props> = ({
  setDocumentKey,
  setContent,
  documents,
  setDocuments,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>("");
  const [newDocumentContent, setNewDocumentContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {};

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="fixed top-0 z-10 flex flex-col h-screen px-2 border-r-2 left-16 w-80 border-r-line bg-body">
      <div className="flex items-center px-3 py-3 shring-0">
        <h2 className="text-lg font-semibold shrink-0">Documents</h2>
        <div className="grow"></div>
        <button>
          <Options className="w-7 h-7" />
        </button>
      </div>
      <div className="flex px-3 space-x-2 shrink-0">
        <div className="relative h-10 rounded-md bg-card">
          <input
            className="w-full h-10 pl-4 pr-10 rounded-md bg-card"
            spellCheck={false}
            data-ms-editor={false}
          />
          <div className="absolute inset-y-0 right-0 grid w-10 place-items-center">
            <SearchIcon className="w-5 h-5 text-brandGray" />
          </div>
        </div>
        <div className="grid w-10 h-10 rounded-md bg-brandWhite place-items-center shrink-0">
          <PencilSquareIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

// * Document item to show each document stored seperately
function DocumentItem({
  document,
  onClick,
}: {
  document: DocumentProps;
  onClick: (key: string) => void;
}) {
  return (
    <div className="py-1">
      <div
        className={`px-3 py-2 text-sm w-full rounded-md ${
          document.isSelected ? "selected-conversation" : "bg-card"
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
