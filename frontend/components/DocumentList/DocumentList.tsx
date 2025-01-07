import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Options from "../icons/Options";
import PencilSquareIcon from "../icons/PencilSquareIcon";
import SearchIcon from "../icons/SearchIcon";
import { v4 as uuidv4 } from "uuid";
import ListAllIcon from "../icons/ListAllIcon";

export type DocumentProps = {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
};

const createNewDocument = (): DocumentProps => {
  return {
    key: uuidv4(),
    title: "New Document",
    content: "New Document",
    isSelected: false,
  };
};

type Props = {
  setKey: (key: string) => void;
  setContent: (content: string) => void;
  documents: DocumentProps[];
  setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedDocumentKey: (key: string) => void;
};

const DocumentList: React.FC<Props> = ({
  setKey,
  setContent,
  documents,
  setDocuments,
  setSelectedDocumentKey,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>("");
  const [newDocumentContent, setNewDocumentContent] = useState<string>("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("/api/documents");
      const formattedDocuments = response.data.map((document: any) => {
        return {
          ...document,
          title: document.title,
          content: document.content,
        };
      });
      setDocuments(formattedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDocumentClick = async (key: string) => {
    setSelectedDocumentKey(key);
    setDocuments((prevDocuments) =>
      prevDocuments.map((document) =>
        document.key === key
          ? { ...document, isSelected: true }
          : { ...document, isSelected: false }
      )
    );

    const selectedDocument = documents.find((document) => document.key === key);
    if (selectedDocument) {
      setSelectedDocument(selectedDocument);
      setKey(selectedDocument.key);
      try {
        const response = await axios.get("/api/documents", {
          params: { key: selectedDocument.key },
        });
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    } else {
      console.error("Document not found");
    }
  };

  const handleNewDocument = async () => {
    try {
      const response = await axios.post("/api/documents", {
        title: newDocumentTitle,
        content: newDocumentContent,
      });
      const newDocument = response.data;
      setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
      setNewDocumentTitle("");
      setNewDocumentContent("");
    } catch (error) {
      console.error("Error creating new document:", error);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      await axios.delete("/api/documents");
    } catch (error) {
      console.error("Error deleting document");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const newDocument = response.data;
        setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
      } catch (error) {
        console.error("Error uploading documents:", error);
      }
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      className="fixed top-0 z-10 flex flex-col h-screen px-2 border-r-2 left-16 w-80 border-r-line bg-body"
      onDragOver={handleDragOver}
    >
      <div className="flex items-center px-3 py-3 shrink-0">
        <h2 className="text-lg font-semibold shrink-0">
          Document Modification
        </h2>

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
          onClick={handleIconClick}
        >
          <PencilSquareIcon className="w-5 h-5 text-brandBlue" />
        </div>
      </div>
      <div className="flex items-center px-3 mt-5 mb-1 uppercase shrink">
        <ListAllIcon className="w-5 h-5" />
        <span className="ml-2 text-sm font-semibold">Documents</span>
      </div>
      <div className="overflow-y-auto grow">
        {documents.map((document) => (
          <Document
            document={document}
            key={document.key}
            onClick={handleDocumentClick}
          />
        ))}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

function Document({
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
