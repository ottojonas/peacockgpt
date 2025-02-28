import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Options from "../icons/Options";
import UploadIcon from "../icons/UploadIcon/UploadIcon";

type DocumentItem = {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
};

interface Props {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setDocumentKey: (key: string) => void;
}

const DocumentHistory: React.FC<Props> = ({
  setDocumentKey,
  documents = [],
  setDocuments,
  setTitle,
  setContent,
}) => {
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>("");
  const [newDocumentContent, setNewDocumentContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(
    null
  );

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

  const handleDocumentClick = async (key: string) => {
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
      setDocumentKey(selectedDocument.key);
      try {
        const response = await axios.get("/api/documents", {
          params: { documentKey: selectedDocument.key },
        });
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error("Error fetching document data: ", error);
      }
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
        const newDocument = response.data.document;
        setDocuments((prevDocuments) => {
          const updatedDocuments = prevDocuments.map((doc) => ({
            ...doc,
            isSelected: false,
          }));
          return [...updatedDocuments, { ...newDocument, isSelected: true }];
        });
        setSelectedDocument(newDocument);
        setDocumentKey(newDocument.key);
        setTitle(newDocument.title);
        setContent(newDocument.content);
        console.log(
          `Successfully uploaded new document: title: ${newDocument.title}`
        );
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="fixed top-0 z-10 flex flex-col h-screen px-2 border-r-2 left-16 w-80 border-r-line bg-body"
      onDragOver={handleDragOver}
    >
      <div className="flex items-center px-3 py-3 shrink-0">
        <h2 className="text-lg font-semibold shrink-0">Documents</h2>
        <div className="grow"></div>
        <button>
          <Options className="2-7 h-7" />
        </button>
      </div>
      <div
        className="grid w-10 h-10 rounded-md bg-brandWhite place-items-center shrink-0"
        onClick={handleIconClick}
      >
        <UploadIcon className="w-5 h-5 text-brandBlue" />
      </div>
      <div className="overflow-y-auto grow">
        {documents.map((document) => (
          <DocumentHistoryItem
            key={document.key}
            document={document}
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
        className={`px-3 py-2 test-sm w-full rounded-md ${
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

export default DocumentHistory;
